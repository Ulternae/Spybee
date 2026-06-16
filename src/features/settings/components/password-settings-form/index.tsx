"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/common/form-errors";
import { InputPassword } from "@/components/ui/input-password";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { changePasswordAction } from "../../actions/change-password/change-password.action";
import { setPasswordAction } from "../../actions/set-password/set-password.action";
import type {
  ChangePasswordState,
  SetPasswordState,
} from "../../types/form.types";
import styles from "./password-settings-form.module.scss";

interface PasswordSettingsFormProps {
  hasPassword: boolean;
  onCompleted?: () => void;
}

const initialSetPasswordState: SetPasswordState = {
  status: FORM_STATUS.IDLE,
  values: {
    newPassword: "",
    confirmPassword: "",
  },
};

const initialChangePasswordState: ChangePasswordState = {
  status: FORM_STATUS.IDLE,
  values: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
};

const PasswordSettingsForm = ({ hasPassword, onCompleted }: PasswordSettingsFormProps) => {
  const t = useTranslations("settings.security.password");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [setPasswordState, setPassword, isSetPending] = useActionState(
    setPasswordAction,
    initialSetPasswordState,
  );
  const [changePasswordState, changePassword, isChangePending] = useActionState(
    changePasswordAction,
    initialChangePasswordState,
  );

  const state = hasPassword ? changePasswordState : setPasswordState;
  const action = hasPassword ? changePassword : setPassword;
  const isPending = hasPassword ? isChangePending : isSetPending;
  const showError = Object.keys(state.fieldErrors ?? {}).length > 1;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    toast.success(hasPassword ? t("updated") : t("created"));
    onCompleted?.();
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPassword, state.status, t]);

  return (
    <form action={action} className={styles.form}>
      {hasPassword && (
        <InputPassword
          name="currentPassword"
          autoComplete="current-password"
          placeholder={tCommon("fields.currentPassword")}
          defaultValue={changePasswordState.values.currentPassword}
          isInvalid={Boolean(changePasswordState.fieldErrors?.currentPassword)}
          showErrorLabel={showError}
          required
        />
      )}

      <InputPassword
        name="newPassword"
        autoComplete="new-password"
        placeholder={tCommon("fields.newPassword")}
        defaultValue={state.values.newPassword}
        isInvalid={Boolean(state.fieldErrors?.newPassword)}
        showErrorLabel={showError}
        required
      />

      <InputPassword
        name="confirmPassword"
        autoComplete="new-password"
        placeholder={tCommon("fields.confirmNewPassword")}
        defaultValue={state.values.confirmPassword}
        isInvalid={Boolean(state.fieldErrors?.confirmPassword)}
        showErrorLabel={showError}
        required
      />

      <p className={styles.hint}>{t("hint")}</p>

      <FormErrors fieldErrors={state.fieldErrors} formError={state.formError} />

      <div className={styles.actions}>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? tCommon("actions.loading")
            : hasPassword
              ? t("change")
              : t("create")}
        </Button>
      </div>
    </form>
  );
};

export { PasswordSettingsForm };
