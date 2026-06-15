
"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { signUpSchema } from "../../schemas/sign-up.schema";
import { authClient } from "@/lib/auth/client";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import type { SignUpInput } from "../../schemas/sign-up.schema";
import type { SignUpState } from "../../types/form.types";

const signUpAction = async (_: SignUpState, formData: FormData): Promise<SignUpState> => {

  const data = Object.fromEntries(formData);
  const parsed = signUpSchema.safeParse(data);
  const values: Partial<SignUpInput> = {
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
  };

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { error } = await authClient.signUp.email({
      ...parsed.data,
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { signUpAction };
