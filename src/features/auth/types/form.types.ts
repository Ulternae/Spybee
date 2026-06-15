import type { FormActionState } from "@/lib/forms/form-action-state";
import type { ForgotPasswordInput } from "../schemas/forgot-password.schema";
import type { ResetPasswordInput } from "../schemas/reset-password.schema";
import type { SignInInput } from "../schemas/sign-in.schema";
import type { SignUpInput } from "../schemas/sign-up.schema";
import type { VerifyTwoFactorInput } from "../schemas/verify-two-factor.schema";

type SignInState = FormActionState<SignInInput>;
type SignUpState = FormActionState<SignUpInput>;
type ForgotPasswordState = FormActionState<ForgotPasswordInput>;
type ResetPasswordState = FormActionState<ResetPasswordInput>;
type TwoFactorState = FormActionState<VerifyTwoFactorInput>;

export type {
  SignInState,
  SignUpState,
  ForgotPasswordState,
  ResetPasswordState,
  TwoFactorState,
};

