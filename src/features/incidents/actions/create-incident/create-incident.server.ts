"use server";

import { cookies, headers } from "next/headers";
import { ParticipantRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import type { IncidentFormInput } from "../../schemas/incident.schema";
import type { IncidentFormState } from "../../types/form.types";

interface CreateIncidentServerActionInput {
  data: IncidentFormInput;
  values: Partial<IncidentFormInput>;
}

const getDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate;
};

const createIncidentServerAction = async ({ data, values }: CreateIncidentServerActionInput): Promise<IncidentFormState> => {
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

    if (!access.canCreateIncidents) {
      return createFormErrorState(values, "UNAUTHORIZED");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: activeProjectId,
      },
      select: {
        id: true,
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

    const incident = await prisma.$transaction(async (tx) => {
      const lastIncident = await tx.incident.findFirst({
        where: {
          projectId: activeProjectId,
        },
        orderBy: {
          sequenceNo: "desc",
        },
        select: {
          sequenceNo: true,
        },
      });

      const createdIncident = await tx.incident.create({
        data: {
          projectId: activeProjectId,
          sequenceNo: (lastIncident?.sequenceNo ?? 0) + 1,
          categoryId: data.categoryId,
          createdById: session.user.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          latitude: data.latitude,
          longitude: data.longitude,
          locationDescription: data.locationDescription || null,
          dueDate: getDueDate(),
        },
        select: {
          id: true,
        },
      });

      if (data.tagIds.length) {
        await tx.incidentTag.createMany({
          data: data.tagIds.map((tagId) => ({
            incidentId: createdIncident.id,
            tagId,
          })),
        });
      }

      const participants = [
        ...data.assigneeIds.map((userId) => ({
          incidentId: createdIncident.id,
          userId,
          role: ParticipantRole.ASSIGNEE,
        })),
        ...data.observerIds.map((userId) => ({
          incidentId: createdIncident.id,
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

      return createdIncident;
    });

    return createSuccessFormState(values, {
      incidentId: incident.id,
    });
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { createIncidentServerAction };
