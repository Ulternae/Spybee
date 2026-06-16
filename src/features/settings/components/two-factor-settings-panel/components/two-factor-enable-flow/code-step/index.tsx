"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/common/form-errors";
import { InputOTPMethod, METHOD_AUTH } from "@/components/ui/input-otp-method";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { verifyEnableTwoFactorAction } from "@/features/settings/actions/verify-enable-two-factor/verify-enable-two-factor.action";
import type { VerifyEnableTwoFactorState } from "@/features/settings/types/form.types";
import styles from "../../../two-factor-settings-panel.module.scss";
import {
  TWO_FACTOR_ENABLE_STEPS,
  type TwoFactorEnableStep,
} from "../two-factor-enable-flow.types";

const INITIAL_STATE: VerifyEnableTwoFactorState = {
  status: FORM_STATUS.IDLE,
  values: {
    code: "",
  },
};

interface CodeStepProps {
  setStep: Dispatch<SetStateAction<TwoFactorEnableStep>>;
}

const CodeStep = ({ setStep }: CodeStepProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");
  const formRef = useRef<HTMLFormElement>(null);
  const [code, setCode] = useState("");
  const [state, action, isPending] = useActionState<
    VerifyEnableTwoFactorState,
    FormData
  >(verifyEnableTwoFactorAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    setStep(TWO_FACTOR_ENABLE_STEPS.BACKUP_CODES);
  }, [setStep, state.status]);

  return (
    <form ref={formRef} action={action} className={styles.stepCard}>
      <section className={styles.formRow}>
        <InputOTPMethod
          method={METHOD_AUTH.TOTP}
          value={code}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={setCode}
          onComplete={() => formRef.current?.requestSubmit()}
          showSeparator={false}
          disabled={isPending}
        />
        <div className={styles.stepHeader}>
          <p>{t("code_step.description")}</p>
        </div>
      </section>

      <input type="hidden" name="code" value={code} />

      <FormErrors
        fieldErrors={state.fieldErrors}
        formError={state.formError}
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={isPending || code.length !== 6}>
          {isPending ? tCommon("actions.loading") : t("verify")}
        </Button>
      </div>
    </form>
  );
};

export { CodeStep };
