"use server";

import { headers } from "next/headers";
import { ProjectRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";

interface AddProjectMemberActionInput {
  projectId: string;
  userId: string;
}

const addProjectMemberAction = async ({
  projectId,
  userId,
}: AddProjectMemberActionInput) => {
  if (!projectId) {
    return createFormErrorState({}, "PROJECT_NOT_FOUND");
  }

  if (!userId) {
    return createFormErrorState({}, "USER_NOT_FOUND");
  }

  const { canManageProjectMembers } = await getProjectAccess(projectId);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !canManageProjectMembers) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        organizationId: true,
      },
    });

    if (!project) {
      return createFormErrorState({}, "PROJECT_NOT_FOUND");
    }

    const organizationMember = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: project.organizationId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!organizationMember) {
      return createFormErrorState({}, "USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION");
    }

    const existingProjectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingProjectMember) {
      return createFormErrorState({}, "USER_IS_ALREADY_A_MEMBER_OF_THIS_PROJECT");
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: ProjectRole.VIEWER,
      },
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { addProjectMemberAction };
