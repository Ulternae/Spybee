"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTPMethod,
  METHOD_AUTH,
  type MethodAuth,
} from "@/components/ui/input-otp-method";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { verifyTwoFactorAction } from "../../actions/verify-two-factor/verify-two-factor.action";
import { AuthPendingState } from "../auth-pending-state";
import type { TwoFactorState } from "../../types/form.types";
import styles from "./two-factor-form.module.scss";

const INITIAL_STATE: TwoFactorState = {
  status: FORM_STATUS.IDLE,
  values: {
    backupCode: "",
    totpCode: "",
  },
};

const TwoFactorForm = () => {

  const [method, setMethod] = useState<MethodAuth>(METHOD_AUTH.TOTP);
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const [state, action, isPending] = useActionState<TwoFactorState, FormData>(
    verifyTwoFactorAction,
    INITIAL_STATE,
  );

  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const isBackupMethod = method === METHOD_AUTH.BACKUP;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    router.replace("/");
  }, [router, state.status]);

  const handleToggleMethod = () => {
    setMethod((current) =>
      current === METHOD_AUTH.TOTP ? METHOD_AUTH.BACKUP : METHOD_AUTH.TOTP,
    );
    setTotpCode("");
    setBackupCode("");
  };

  const handleCodeChange = (code: string) => {
    if (isBackupMethod) {
      setBackupCode(code);
      return;
    }

    setTotpCode(code);
  };

  return (
    <form ref={formRef} action={action} className={styles.form}>
      {isCompleted ? (
        <AuthPendingState
          className={styles.completed}
          label={tCommon("actions.redirecting")}
        />
      ) : (
        <>
          <InputOTPMethod
            value={isBackupMethod ? backupCode : totpCode}
            method={method}
            showSeparator={false}
            pattern={isBackupMethod ? undefined : REGEXP_ONLY_DIGITS}
            onChange={handleCodeChange}
            onComplete={() => formRef.current?.requestSubmit()}
            inputSlotClassName={cn(isBackupMethod && styles.backupSlot)}
            disabled={isPending}
          />

          <Button
            variant="link"
            type="button"
            className={styles.methodToggle}
            onClick={handleToggleMethod}
          >
            {isBackupMethod
              ? tAuth("actions.use_totp_code")
              : tAuth("actions.use_backup_code")}
          </Button>

          <FormErrors
            fieldErrors={state.fieldErrors}
            formError={state.formError}
          />
        </>
      )}

      <input type="hidden" name="totpCode" value={totpCode} />
      <input type="hidden" name="backupCode" value={backupCode} />
    </form>
  );

};

export { TwoFactorForm };
