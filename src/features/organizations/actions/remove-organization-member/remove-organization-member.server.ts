"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getOrganizationAccess } from "@/lib/auth/access/get-organization-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";

interface RemoveOrganizationMemberActionInput {
  organizationId: string;
  userId: string;
}

const removeOrganizationMemberAction = async ({ organizationId, userId }: RemoveOrganizationMemberActionInput) => {

  if (!organizationId) {
    return createFormErrorState({}, "ORGANIZATION_NOT_FOUND");
  }

  if (!userId) {
    return createFormErrorState({}, "USER_NOT_FOUND");
  }

  const { canManageMembers } = await getOrganizationAccess();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    if (!canManageMembers) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    if (session.user.id === userId) {
      return createFormErrorState({}, "YOU_CANNOT_REMOVE_YOURSELF");
    }

    const targetMember = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
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

    if (targetMember.role === "owner") {
      const ownerCount = await prisma.member.count({
        where: {
          organizationId,
          role: "owner",
        },
      });

      if (ownerCount <= 1) {
        return createFormErrorState({}, "YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER");
      }
    }

    await prisma.$transaction(async (tx) => {
      const organizationProjects = await tx.project.findMany({
        where: {
          organizationId,
        },
        select: {
          id: true,
        },
      });
      const projectIds = organizationProjects.map((project) => project.id);

      if (projectIds.length > 0) {
        await tx.projectMember.deleteMany({
          where: {
            userId,
            projectId: {
              in: projectIds,
            },
          },
        });
      }

      await tx.member.delete({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
      });

      await tx.session.updateMany({
        where: {
          userId,
          activeOrganizationId: organizationId,
        },
        data: {
          activeOrganizationId: null,
        },
      });
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { removeOrganizationMemberAction };
