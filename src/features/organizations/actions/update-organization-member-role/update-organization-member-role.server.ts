"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getOrganizationAccess } from "@/lib/auth/access/get-organization-access";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { isOrganizationMemberRole } from "../../lib/organization-member-roles";

interface UpdateOrganizationMemberRoleActionInput {
  organizationId: string;
  userId: string;
  role: string;
}

const updateOrganizationMemberRoleAction = async ({ organizationId, userId, role }: UpdateOrganizationMemberRoleActionInput) => {
  if (!organizationId) {
    return createFormErrorState({}, "ORGANIZATION_NOT_FOUND");
  }

  if (!userId) {
    return createFormErrorState({}, "USER_NOT_FOUND");
  }

  if (!isOrganizationMemberRole(role)) {
    return createFormErrorState({}, "INVALID_ROLE");
  }

  const { canManageMembers } = await getOrganizationAccess();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !canManageMembers) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    if (session.user.id === userId) {
      return createFormErrorState({}, "YOU_CANNOT_UPDATE_YOUR_OWN_ROLE");
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

    if (targetMember.role === role) {
      return createSuccessFormState({}, {});
    }

    if (targetMember.role === "owner" && role !== "owner") {
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

    await prisma.member.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: {
        role,
      },
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { updateOrganizationMemberRoleAction };
