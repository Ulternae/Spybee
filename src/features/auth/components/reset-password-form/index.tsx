"use client";

import { useActionState, useEffect, useRef } from "react";
import { MinaLogin } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input-password";
import { Link, useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { resetPasswordAction } from "../../actions/reset-password/reset-password.action";
import { AuthPendingState } from "../auth-pending-state";
import type { ResetPasswordState } from "../../types/form.types";
import styles from "./reset-password-form.module.scss";

interface ResetPasswordFormProps {
  token: string;
}

const INITIAL_STATE: ResetPasswordState = {
  status: FORM_STATUS.IDLE,
  values: {
    confirmPassword: "",
    newPassword: "",
  },
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {

  const [state, action, isPending] = useActionState<ResetPasswordState, FormData>(resetPasswordAction.bind(null, token), INITIAL_STATE);
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const hasShownSuccessToast = useRef(false);

  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const fieldErrorCount = Object.keys(state.fieldErrors ?? {}).length;
  const showErrorLabel = fieldErrorCount > 1;

  useEffect(() => {
    if (!isCompleted) {
      return;
    }

    if (!hasShownSuccessToast.current) {
      hasShownSuccessToast.current = true;
      toast.success(tAuth("screens.reset_password.message"));
    }

    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isCompleted, router, tAuth]);

  return (
    <form action={action} className={styles.form}>
      {isCompleted ? (
        <AuthPendingState
          className={styles.completed}
          label={tCommon("actions.redirecting")}
        />
      ) : (
        <>
          <InputPassword
            name="newPassword"
            autoComplete="new-password"
            placeholder={tCommon("fields.newPassword")}
            isInvalid={Boolean(state.fieldErrors?.newPassword)}
            showErrorLabel={showErrorLabel}
            required
          />
          <InputPassword
            name="confirmPassword"
            autoComplete="new-password"
            placeholder={tCommon("fields.confirmPassword")}
            isInvalid={Boolean(state.fieldErrors?.confirmPassword)}
            showErrorLabel={showErrorLabel}
            required
          />

          <FormErrors
            fieldErrors={state.fieldErrors}
            formError={state.formError}
          />
        </>
      )}

      <div className={styles.actions}>
        <Button
          variant="outline"
          size="icon"
          asChild
          aria-label={tAuth("actions.sign_in")}
        >
          <Link href="/login">
            <MinaLogin aria-hidden="true" />
          </Link>
        </Button>
        <Button type="submit" disabled={isPending || isCompleted}>
          {isPending ? tCommon("actions.loading") : tCommon("actions.confirm")}
        </Button>
      </div>
    </form>
  );

};

export { ResetPasswordForm };
