import type { FormActionState } from "@/lib/forms/form-action-state";
import type { SetPasswordInput } from "../schemas/set-password.schema";
import type { ChangePasswordInput } from "../schemas/change-password.schema";
import type { DisableTwoFactorInput } from "../schemas/disable-two-factor.schema";
import type { EnableTwoFactorInput } from "../schemas/enable-two-factor.schema";
import type { VerifyEnableTwoFactorInput } from "../schemas/verify-enable-two-factor.schema";
import type { TwoFactorSetupData } from "./two-factor.types";

type SetPasswordState = FormActionState<SetPasswordInput>;
type ChangePasswordState = FormActionState<ChangePasswordInput>;
type DisableTwoFactorState = FormActionState<DisableTwoFactorInput>;
type EnableTwoFactorState = FormActionState<
  EnableTwoFactorInput,
  TwoFactorSetupData
>;
type VerifyEnableTwoFactorState =
  FormActionState<VerifyEnableTwoFactorInput>;

export type {
  ChangePasswordState,
  DisableTwoFactorState,
  EnableTwoFactorState,
  SetPasswordState,
  VerifyEnableTwoFactorState,
};
