"use server";

import { headers } from "next/headers";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { auth } from "@/lib/auth/auth";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import type { ChangePasswordState } from "../../types/form.types";
import type { ChangePasswordInput } from "../../schemas/change-password.schema";

interface ChangePasswordServerAction {
  data: ChangePasswordInput;
  values: ChangePasswordInput;
}

const changePasswordServerAction = async ({ data, values }: ChangePasswordServerAction): Promise<ChangePasswordState> => {
  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      },
    });

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { changePasswordServerAction };