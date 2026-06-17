"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { getOrganizationAccess } from "@/lib/auth/access/get-organization-access";

interface AddOrganizationMemberActionInput {
  organizationId: string;
  userId: string;
}


const addOrganizationMemberAction = async ({ organizationId, userId }: AddOrganizationMemberActionInput) => {

  if (!organizationId) {
    return createFormErrorState({}, "ORGANIZATION_NOT_FOUND");
  }

  if (!userId) {
    return createFormErrorState({}, "USER_NOT_FOUND");
  }

  const { canManageMembers } = await getOrganizationAccess()

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    const currentMember = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: session.user.id,
        },
      },
      select: {
        role: true,
      },
    });

    if (!currentMember || !canManageMembers) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return createFormErrorState({}, "USER_NOT_FOUND");
    }

    const existingMember = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingMember) {
      return createFormErrorState({}, "USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION");
    }

    await prisma.member.create({
      data: {
        organizationId,
        userId,
        role: "member",
      },
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { addOrganizationMemberAction };
