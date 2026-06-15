"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";
import { resetPasswordSchema } from "../../schemas/reset-password.schema";
import type { ResetPasswordInput } from "../../schemas/reset-password.schema";
import type { ResetPasswordState } from "../../types/form.types";

const resetPasswordAction = async (token: string, _: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> => {

  const data = Object.fromEntries(formData);
  const parsed = resetPasswordSchema.safeParse(data);
  const values: Partial<ResetPasswordInput> = {};

  if (!token) {
    return createFormErrorState(values, "INVALID_TOKEN");
  }

  if (!parsed.success) {
    return createValidationErrorState<ResetPasswordInput>(
      values,
      parsed.error,
    );
  }

  try {
    const { error } = await authClient.resetPassword({
      newPassword: parsed.data.newPassword,
      token: token,
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { resetPasswordAction };
