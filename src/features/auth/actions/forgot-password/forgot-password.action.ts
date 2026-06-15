"use server";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { auth } from "@/lib/auth/auth";
import { ForgotPasswordInput, forgotPasswordSchema } from "../../schemas/forgot-password.schema";
import type { ForgotPasswordState } from "../../types/form.types";

const forgotPasswordAction = async (_: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> => {

  const values: ForgotPasswordInput = {
    email: String(formData.get("email") ?? ""),
  };

  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: "/reset-password",
      },
    });

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { forgotPasswordAction };
