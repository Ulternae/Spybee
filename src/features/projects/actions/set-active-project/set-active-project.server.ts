"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { COOKIE_KEYS } from "@/lib/http/cookies";

interface SetActiveProjectServerActionInput {
  projectId: string;
}

const ACTIVE_PROJECT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const setActiveProjectServerAction = async ({ projectId }: SetActiveProjectServerActionInput) => {

  if (!projectId) {
    return createFormErrorState({}, "PROJECT_NOT_FOUND");
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createFormErrorState({}, "UNAUTHORIZED");
    }

    const activeOrganizationId = session.session.activeOrganizationId;

    if (!activeOrganizationId) {
      return createFormErrorState({}, "NO_ACTIVE_ORGANIZATION");
    }

    const projectMember = await prisma.projectMember.findFirst({
      where: {
        userId: session.user.id,
        project: {
          id: projectId,
          organizationId: activeOrganizationId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!projectMember) {
      return createFormErrorState({}, "PROJECT_NOT_FOUND");
    }

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_KEYS.ACTIVE_PROJECT_ID, projectId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACTIVE_PROJECT_COOKIE_MAX_AGE,
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { setActiveProjectServerAction };
