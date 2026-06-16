"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "../../two-factor-settings-panel.module.scss";
import { BackupCodesStep } from "./backup-codes-step";
import { CodeStep } from "./code-step";
import { PasswordStep } from "./password-step";
import { QrStep } from "./qr-step";
import {
  TWO_FACTOR_ENABLE_STEPS,
  type TwoFactorEnableStep,
  type TwoFactorSetupData,
} from "./two-factor-enable-flow.types";

interface TwoFactorEnableFlowProps {
  onCompleted: () => void;
}

const TwoFactorEnableFlow = ({ onCompleted }: TwoFactorEnableFlowProps) => {
  const t = useTranslations("settings.security.two_factor");
  const [step, setStep] = useState<TwoFactorEnableStep>(
    TWO_FACTOR_ENABLE_STEPS.PASSWORD,
  );
  const [twoFAData, setTwoFAData] = useState<TwoFactorSetupData>({
    totpURI: null,
    backupCodes: [],
  });

  return (
    <div className={styles.flow}>
      <ol className={styles.steps}>
        {Object.values(TWO_FACTOR_ENABLE_STEPS).map((item) => (
          <li key={item} data-active={step === item}>
            <span>{t(`steps.${item}`)}</span>
          </li>
        ))}
      </ol>

      {step === TWO_FACTOR_ENABLE_STEPS.PASSWORD && (
        <PasswordStep
          setStep={setStep}
          setTwoFAData={setTwoFAData}
        />
      )}

      {step === TWO_FACTOR_ENABLE_STEPS.QR && (
        <QrStep setStep={setStep} twoFAData={twoFAData} />
      )}

      {step === TWO_FACTOR_ENABLE_STEPS.CODE && (
        <CodeStep setStep={setStep} />
      )}

      {step === TWO_FACTOR_ENABLE_STEPS.BACKUP_CODES && (
        <BackupCodesStep
          twoFAData={twoFAData}
          onCompleted={onCompleted}
        />
      )}
    </div>
  );
};

export { TwoFactorEnableFlow };
