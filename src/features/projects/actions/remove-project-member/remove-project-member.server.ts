"use server";

import { headers } from "next/headers";
import { ProjectRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";

interface RemoveProjectMemberActionInput {
  projectId: string;
  userId: string;
}

const removeProjectMemberAction = async ({
  projectId,
  userId,
}: RemoveProjectMemberActionInput) => {
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

    if (session.user.id === userId) {
      return createFormErrorState({}, "YOU_CANNOT_REMOVE_YOURSELF");
    }

    const targetMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!targetMember) {
      return createFormErrorState({}, "MEMBER_NOT_FOUND");
    }

    if (targetMember.role === ProjectRole.PROJECT_ADMIN) {
      const adminCount = await prisma.projectMember.count({
        where: {
          projectId,
          role: ProjectRole.PROJECT_ADMIN,
        },
      });

      if (adminCount <= 1) {
        return createFormErrorState({}, "YOU_CANNOT_LEAVE_THE_PROJECT_WITHOUT_AN_ADMIN");
      }
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { removeProjectMemberAction };
