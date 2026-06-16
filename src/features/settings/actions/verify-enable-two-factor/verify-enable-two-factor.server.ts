"use server";

import { headers } from "next/headers";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { auth } from "@/lib/auth/auth";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import type { VerifyEnableTwoFactorState } from "../../types/form.types";
import type { VerifyEnableTwoFactorInput } from "../../schemas/verify-enable-two-factor.schema";

interface VerifyEnableTwoFactorServerActionProps {
  data: VerifyEnableTwoFactorInput;
  values: VerifyEnableTwoFactorInput;
}

const verifyEnableTwoFactorServerAction = async ({ data, values }: VerifyEnableTwoFactorServerActionProps): Promise<VerifyEnableTwoFactorState> => {
  try {
    await auth.api.verifyTOTP({
      headers: await headers(),
      body: {
        code: data.code,
      },
    });

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { verifyEnableTwoFactorServerAction };
