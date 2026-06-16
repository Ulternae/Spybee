"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MinaKey } from "@zcorvus/icons-react";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input-password";
import { FormErrors } from "@/components/common/form-errors";
import { FORM_STATUS } from "@/lib/forms/form-status";

import {
  type TwoFactorEnableStep,
  type TwoFactorSetupData,
  TWO_FACTOR_ENABLE_STEPS
} from "../two-factor-enable-flow.types";

import styles from "../../../two-factor-settings-panel.module.scss";
import { EnableTwoFactorState } from "@/features/settings/types/form.types";
import { enableTwoFactorAction } from "@/features/settings/actions/enable-two-factor/enable-two-factor.action";

const INITIAL_STATE: EnableTwoFactorState = {
  status: FORM_STATUS.IDLE,
  values: {
    password: "",
  },
};

interface PasswordStepProps {
  setStep: Dispatch<SetStateAction<TwoFactorEnableStep>>;
  setTwoFAData: Dispatch<SetStateAction<TwoFactorSetupData>>;
}

const PasswordStep = ({ setStep, setTwoFAData }: PasswordStepProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");

  const [password, setPassword] = useState("");
  const [state, action, isPending] = useActionState<EnableTwoFactorState, FormData>(enableTwoFactorAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS || !state.data) {
      return;
    }

    setTwoFAData(state.data);
    setStep(TWO_FACTOR_ENABLE_STEPS.QR);
  }, [setStep, setTwoFAData, state]);

  return (
    <form action={action} className={styles.stepCard}>
      <section className={styles.formRow}>

        <InputPassword
          name="password"
          autoComplete="current-password"
          placeholder={tCommon("fields.currentPassword")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isPending}
        />

        <p>{t("password_step.description")}</p>
      </section>


      <FormErrors
        fieldErrors={state.fieldErrors}
        formError={state.formError}
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={isPending || !password}>
          {isPending ? tCommon("actions.loading") : tCommon("actions.next")}
        </Button>
      </div>
    </form>
  );
};

export { PasswordStep };
