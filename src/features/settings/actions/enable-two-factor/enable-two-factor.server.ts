"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { EnableTwoFactorState } from "../../types/form.types";
import { createFormErrorState, createSuccessFormState } from "@/lib/forms/form-action-state";
import { EnableTwoFactorInput } from "../../schemas/enable-two-factor.schema";
import { extractErrorCode } from "@/lib/errors/extract-error-code";

interface EnableTwoFactorServerActionProps {
  data: EnableTwoFactorInput;
  values: EnableTwoFactorInput;
}

const enableTwoFactorServerAction = async ({ data, values }: EnableTwoFactorServerActionProps): Promise<EnableTwoFactorState> => {
  try {
    const twoFactorData = await auth.api.enableTwoFactor({
      headers: await headers(),
      body: {
        password: data.password,
      },
    });

    return createSuccessFormState(values, {
      totpURI: twoFactorData.totpURI,
      backupCodes: twoFactorData.backupCodes,
    });
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { enableTwoFactorServerAction };
