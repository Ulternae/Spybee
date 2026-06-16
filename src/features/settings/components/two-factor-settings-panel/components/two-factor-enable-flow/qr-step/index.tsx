"use client";

import type { Dispatch, SetStateAction } from "react";
import QRCode from "react-qr-code";
import { MinaCopy } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import styles from "../../../two-factor-settings-panel.module.scss";
import {
  TWO_FACTOR_ENABLE_STEPS,
  type TwoFactorEnableStep,
  type TwoFactorSetupData,
} from "../two-factor-enable-flow.types";

interface QrStepProps {
  setStep: Dispatch<SetStateAction<TwoFactorEnableStep>>;
  twoFAData: TwoFactorSetupData;
}

const QrStep = ({ setStep, twoFAData }: QrStepProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");

  const handleCopy = async () => {
    if (!twoFAData.totpURI) {
      return;
    }

    await navigator.clipboard.writeText(twoFAData.totpURI);
    toast.success(t("copied"));
  };

  if (!twoFAData.totpURI) {
    return null;
  }

  return (
    <div className={styles.stepCard}>
      <div className={styles.qrRow}>
        <div className={styles.qr}>
          <QRCode value={twoFAData.totpURI} size={180} />
        </div>
        <div className={styles.secret}>
          <p>{t("scan")}</p>
          <button
            type="button"
            className={styles.secretCode}
            onClick={handleCopy}
          >
            <span>{twoFAData.totpURI}</span>
            <MinaCopy aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          onClick={() => setStep(TWO_FACTOR_ENABLE_STEPS.CODE)}
        >
          {tCommon("actions.next")}
        </Button>
      </div>
    </div>
  );
};

export { QrStep };
