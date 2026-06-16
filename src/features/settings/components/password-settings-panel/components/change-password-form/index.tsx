"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/common/form-errors";
import { InputPassword } from "@/components/ui/input-password";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { changePasswordAction } from "@/features/settings/actions/change-password/change-password.action";
import type { ChangePasswordState } from "@/features/settings/types/form.types";
import styles from "../../password-settings-panel.module.scss";

interface ChangePasswordFormProps {
  onCompleted?: () => void;
}

const initialState: ChangePasswordState = {
  status: FORM_STATUS.IDLE,
  values: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
};

const ChangePasswordForm = ({ onCompleted }: ChangePasswordFormProps) => {

  const t = useTranslations("settings.security.password");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [state, action, isPending] = useActionState(changePasswordAction, initialState);
  const showError = Object.keys(state.fieldErrors ?? {}).length > 1;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    toast.success(t("updated"));
    onCompleted?.();
    router.refresh();
  }, [onCompleted, router, state.status, t]);

  return (
    <form action={action} className={styles.form}>
      <InputPassword
        name="currentPassword"
        autoComplete="current-password"
        placeholder={tCommon("fields.currentPassword")}
        defaultValue={state.values.currentPassword}
        isInvalid={Boolean(state.fieldErrors?.currentPassword)}
        showErrorLabel={showError}
        required
      />

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
          {isPending ? tCommon("actions.loading") : t("change")}
        </Button>
      </div>
    </form>
  );
};

export { ChangePasswordForm };
