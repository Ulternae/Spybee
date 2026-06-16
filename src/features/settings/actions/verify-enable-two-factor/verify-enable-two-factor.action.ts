"use client";

import { createValidationErrorState } from "@/lib/forms/form-action-state";
import {
  type VerifyEnableTwoFactorInput,
  verifyEnableTwoFactorSchema,
} from "../../schemas/verify-enable-two-factor.schema";
import type { VerifyEnableTwoFactorState } from "../../types/form.types";
import { verifyEnableTwoFactorServerAction } from "./verify-enable-two-factor.server";

const verifyEnableTwoFactorAction = async (_: VerifyEnableTwoFactorState, formData: FormData): Promise<VerifyEnableTwoFactorState> => {

  const data = Object.fromEntries(formData);
  const values: VerifyEnableTwoFactorInput = {
    code: String(data.code ?? ""),
  };
  const parsed = verifyEnableTwoFactorSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return await verifyEnableTwoFactorServerAction({
    data: parsed.data,
    values,
  });
};

export { verifyEnableTwoFactorAction };
