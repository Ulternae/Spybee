"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";
import { forgotPasswordSchema } from "../../schemas/forgot-password.schema";
import type { ForgotPasswordInput } from "../../schemas/forgot-password.schema";
import type { ForgotPasswordState } from "../../types/form.types";

const forgotPasswordAction = async (_: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> => {

  const data = Object.fromEntries(formData);
  const values: ForgotPasswordInput = {
    email: String(data.email),
  };
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { error } = await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { forgotPasswordAction };
