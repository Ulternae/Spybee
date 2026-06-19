"use server";

import { cookies, headers } from "next/headers";
import { ParticipantRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import {
  createFormErrorState,
  createSuccessFormState,
} from "@/lib/forms/form-action-state";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import type { IncidentFormInput } from "../../schemas/incident.schema";
import type { IncidentFormState } from "../../types/form.types";

interface UpdateIncidentServerActionInput {
  incidentId: string;
  data: IncidentFormInput;
  values: Partial<IncidentFormInput>;
}

const updateIncidentServerAction = async ({ incidentId, data, values }: UpdateIncidentServerActionInput): Promise<IncidentFormState> => {

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createFormErrorState(values, "UNAUTHORIZED");
    }

    const cookieStore = await cookies();
    const activeProjectId = cookieStore.get(COOKIE_KEYS.ACTIVE_PROJECT_ID)?.value;

    if (!activeProjectId) {
      return createFormErrorState(values, "NO_ACTIVE_PROJECT");
    }

    const access = await getProjectAccess(activeProjectId);

    if (!access.canUpdateIncidents) {
      return createFormErrorState(values, "UNAUTHORIZED");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: activeProjectId,
      },
      select: {
        organizationId: true,
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) {
      return createFormErrorState(values, "PROJECT_NOT_FOUND");
    }

    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        projectId: activeProjectId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!incident) {
      return createFormErrorState(values, "INCIDENT_NOT_FOUND");
    }

    const category = await prisma.incidentCategory.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return createFormErrorState(values, "INCIDENT_CATEGORY_NOT_FOUND");
    }

    const projectMemberIds = new Set(project.members.map((member) => member.userId));
    const participantIds = [...data.assigneeIds, ...data.observerIds];
    const hasInvalidParticipant = participantIds.some((userId) => !projectMemberIds.has(userId));

    if (hasInvalidParticipant) {
      return createFormErrorState(values, "INCIDENT_PARTICIPANT_NOT_FOUND");
    }

    const tags = data.tagIds.length
      ? await prisma.tag.findMany({
        where: {
          id: {
            in: data.tagIds,
          },
          organizationId: project.organizationId,
        },
        select: {
          id: true,
        },
      })
      : [];

    if (tags.length !== data.tagIds.length) {
      return createFormErrorState(values, "INCIDENT_TAG_NOT_FOUND");
    }

    await prisma.$transaction(async (tx) => {
      await tx.incident.update({
        where: {
          id: incidentId,
        },
        data: {
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          latitude: data.latitude,
          longitude: data.longitude,
          locationDescription: data.locationDescription || null,
          dueDate: data.dueDate,
        },
      });

      await tx.incidentTag.deleteMany({
        where: {
          incidentId,
        },
      });

      if (data.tagIds.length) {
        await tx.incidentTag.createMany({
          data: data.tagIds.map((tagId) => ({
            incidentId,
            tagId,
          })),
        });
      }

      await tx.incidentParticipant.deleteMany({
        where: {
          incidentId,
        },
      });

      const participants = [
        ...data.assigneeIds.map((userId) => ({
          incidentId,
          userId,
          role: ParticipantRole.ASSIGNEE,
        })),
        ...data.observerIds.map((userId) => ({
          incidentId,
          userId,
          role: ParticipantRole.OBSERVER,
        })),
      ];

      if (participants.length) {
        await tx.incidentParticipant.createMany({
          data: participants,
          skipDuplicates: true,
        });
      }
    });

    return createSuccessFormState(values, {
      incidentId,
    });
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { updateIncidentServerAction };
