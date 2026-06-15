"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";
import { verifyTwoFactorSchema } from "../../schemas/verify-two-factor.schema";
import type { VerifyTwoFactorInput } from "../../schemas/verify-two-factor.schema";
import type { TwoFactorState } from "../../types/form.types";

const verifyTwoFactorAction = async (_: TwoFactorState, formData: FormData): Promise<TwoFactorState> => {

  const data = Object.fromEntries(formData);
  const values: Partial<VerifyTwoFactorInput> = {};
  const parsed = verifyTwoFactorSchema.safeParse(data);

  if (!parsed.success) {
    return createValidationErrorState<VerifyTwoFactorInput>(
      values,
      parsed.error,
    );
  }

  try {
    const response = parsed.data.totpCode
      ? await authClient.twoFactor.verifyTotp({
        code: parsed.data.totpCode,
      })
      : await authClient.twoFactor.verifyBackupCode({
        code: parsed.data.backupCode!,
      });

    if (response.error) {
      return createFormErrorState(
        values,
        extractErrorCode(response.error),
      );
    }

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { verifyTwoFactorAction };
