import type { FormActionState } from "@/lib/forms/form-action-state";
import { SetPasswordInput } from "../schemas/set-password.schema";
import { ChangePasswordInput } from "../schemas/change-password.schema";

type SetPasswordState = FormActionState<SetPasswordInput>;
type ChangePasswordState = FormActionState<ChangePasswordInput>;

export type { ChangePasswordState, SetPasswordState };
