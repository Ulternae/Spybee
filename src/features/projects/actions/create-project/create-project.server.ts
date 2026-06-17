"use server";

import { headers } from "next/headers";
import { ProjectRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createProjectSlug } from "../../lib/create-project-slug";
import type { CreateProjectInput } from "../../schemas/create-project.schema";
import type { CreateProjectState } from "../../types/form.types";

interface CreateProjectServerAction {
  data: CreateProjectInput;
  values: Partial<CreateProjectInput>;
}

const createProjectServerAction = async ({ data, values }: CreateProjectServerAction): Promise<CreateProjectState> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createFormErrorState(values, "UNAUTHORIZED");
    }

    const activeOrganizationId = session.session.activeOrganizationId;

    if (!activeOrganizationId) {
      return createFormErrorState(values, "NO_ACTIVE_ORGANIZATION");
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: activeOrganizationId,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!membership) {
      return createFormErrorState(values, "USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION");
    }

    const slug = createProjectSlug(data.name);
    const existingProject = await prisma.project.findUnique({
      where: {
        organizationId_slug: {
          organizationId: activeOrganizationId,
          slug,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingProject) {
      return createFormErrorState(values, "PROJECT_ALREADY_EXISTS");
    }

    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          organizationId: activeOrganizationId,
          name: data.name,
          slug,
        },
        select: {
          id: true,
        },
      });

      await tx.projectMember.create({
        data: {
          projectId: createdProject.id,
          userId: session.user.id,
          role: ProjectRole.PROJECT_ADMIN,
        },
      });

      return createdProject;
    });

    return createSuccessFormState(values, {
      projectId: project.id,
    });
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { createProjectServerAction };
