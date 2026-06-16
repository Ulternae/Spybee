"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { authClient } from "@/lib/auth/client";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import {
  type VerifyEnableTwoFactorInput,
  verifyEnableTwoFactorSchema,
} from "../../schemas/verify-enable-two-factor.schema";
import type { VerifyEnableTwoFactorState } from "../../types/form.types";

const verifyEnableTwoFactorAction = async (_: VerifyEnableTwoFactorState, formData: FormData): Promise<VerifyEnableTwoFactorState> => {

  const data = Object.fromEntries(formData);
  const values: VerifyEnableTwoFactorInput = {
    code: String(data.code ?? ""),
  };
  const parsed = verifyEnableTwoFactorSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { error } = await authClient.twoFactor.verifyTotp({
      code: parsed.data.code,
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { verifyEnableTwoFactorAction };
