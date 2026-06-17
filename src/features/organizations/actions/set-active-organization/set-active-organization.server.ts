"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";

interface SetActiveOrganizationServerActionState {
  organizationId: string;
}

const setActiveOrganizationServerAction = async ({ organizationId }: SetActiveOrganizationServerActionState) => {

  if (!organizationId) {
    return createFormErrorState({}, "ORGANIZATION_NOT_FOUND");
  }

  try {
    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: { organizationId }
    });

    return createSuccessFormState({}, {});
  } catch (error: unknown) {
    return createFormErrorState({}, extractErrorCode(error));
  }
};

export { setActiveOrganizationServerAction };
