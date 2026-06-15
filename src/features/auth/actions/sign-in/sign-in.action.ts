"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";
import { signInSchema } from "../../schemas/sign-in.schema";
import type { SignInInput } from "../../schemas/sign-in.schema";
import type { SignInResult, SignInState } from "../../types/form.types";

const signInAction = async (_: SignInState, formData: FormData): Promise<SignInState> => {

  const data = Object.fromEntries(formData);
  const parsed = signInSchema.safeParse(data);
  const values: Partial<SignInInput> = {
    email: String(data.email ?? ""),
  };

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { data: authData, error } = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    const result: SignInResult = {
      twoFactorRedirect: authData !== null && "twoFactorRedirect" in authData && authData.twoFactorRedirect === true,
    };

    return createSuccessFormState<SignInInput, SignInResult>(values, result);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { signInAction };
