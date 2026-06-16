"use server"

import { headers } from "next/headers";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { auth } from "@/lib/auth/auth";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import type { SetPasswordInput } from "../../schemas/set-password.schema"
import type { SetPasswordState } from "../../types/form.types";

interface SetPasswordServerAction {
  data: SetPasswordInput,
  values: SetPasswordInput
}

const setPasswordServerAction = async ({ data, values }: SetPasswordServerAction): Promise<SetPasswordState> => {

  try {
    await auth.api.setPassword({
      headers: await headers(),
      body: {
        newPassword: data.newPassword,
      },
    });

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
}

export { setPasswordServerAction }