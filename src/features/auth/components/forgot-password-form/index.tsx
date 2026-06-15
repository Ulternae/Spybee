"use client";

import { useActionState, useEffect, useRef } from "react";
import { MinaLogin } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { forgotPasswordAction } from "../../actions/forgot-password/forgot-password.action";
import type { ForgotPasswordState } from "../../types/form.types";
import styles from "./forgot-password-form.module.scss";

const INITIAL_STATE: ForgotPasswordState = {
  status: FORM_STATUS.IDLE,
  values: {
    email: "",
  },
};

const ForgotPasswordForm = () => {

  const [state, action, isPending] = useActionState<ForgotPasswordState, FormData>(forgotPasswordAction, INITIAL_STATE);
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const hasShownSuccessToast = useRef(false);

  const isCompleted = state.status === FORM_STATUS.SUCCESS;

  useEffect(() => {
    if (!isCompleted || hasShownSuccessToast.current) {
      return;
    }

    hasShownSuccessToast.current = true;
    toast.success(tAuth("actions.email_sent"));
  }, [isCompleted, tAuth]);

  return (
    <form action={action} className={styles.form}>
      <Input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={tCommon("fields.email")}
        defaultValue={state.values.email}
        isInvalid={Boolean(state.fieldErrors?.email)}
        disabled={isCompleted}
        required
      />

      {isCompleted ? (
        <div className={styles.successMessage}>
          <span className={styles.successLabel}>
            {tAuth("actions.email_sent")}
          </span>
          <p>{tAuth("screens.forgot_password.message")}</p>
        </div>
      ) : (
        <FormErrors
          fieldErrors={state.fieldErrors}
          formError={state.formError}
        />
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

export { ForgotPasswordForm };
