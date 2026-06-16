"use client"

import { createValidationErrorState } from "@/lib/forms/form-action-state";
import { EnableTwoFactorInput, enableTwoFactorSchema } from "../../schemas/enable-two-factor.schema"
import { enableTwoFactorServerAction } from "./enable-two-factor.server"
import type { EnableTwoFactorState } from "../../types/form.types"

const enableTwoFactorAction = async (_: EnableTwoFactorState, formData: FormData): Promise<EnableTwoFactorState> => {

  const data = Object.fromEntries(formData)
  const values: EnableTwoFactorInput = {
    password: String(data.password ?? ""),
  };
  const parsed = enableTwoFactorSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return await enableTwoFactorServerAction({ data: parsed.data, values })

}

export { enableTwoFactorAction }
