"use client";

import { createValidationErrorState } from "@/lib/forms/form-action-state";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "../../schemas/change-password.schema";
import { changePasswordServerAction } from "./change-password.server";
import type { ChangePasswordState } from "../../types/form.types";

const changePasswordAction = async (_: ChangePasswordState, formData: FormData,): Promise<ChangePasswordState> => {

  const data = Object.fromEntries(formData);
  const values: ChangePasswordInput = {
    currentPassword: String(data.currentPassword ?? ""),
    newPassword: String(data.newPassword ?? ""),
    confirmPassword: String(data.confirmPassword ?? ""),
  };
  const parsed = changePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return await changePasswordServerAction({ data: parsed.data, values });
};

export { changePasswordAction };