"use client";

import { createValidationErrorState } from "@/lib/forms/form-action-state";
import { SetPasswordInput, setPasswordSchema } from "../../schemas/set-password.schema";
import { setPasswordServerAction } from "./set-password.server";
import type { SetPasswordState } from "../../types/form.types";

const setPasswordAction = async (_: SetPasswordState, formData: FormData): Promise<SetPasswordState> => {

  const data = Object.fromEntries(formData);
  const values: SetPasswordInput = {
    newPassword: String(data.newPassword ?? ""),
    confirmPassword: String(data.confirmPassword ?? ""),
  };
  const parsed = setPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return await setPasswordServerAction({ data: parsed.data, values });

};

export { setPasswordAction };
