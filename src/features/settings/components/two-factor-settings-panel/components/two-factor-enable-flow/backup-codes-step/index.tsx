"use client";

import { useMemo } from "react";
import { MinaClipboard, MinaDownload } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import styles from "../../../two-factor-settings-panel.module.scss";
import { type TwoFactorSetupData } from "../two-factor-enable-flow.types";

interface BackupCodesStepProps {
  onCompleted: () => void;
  twoFAData: TwoFactorSetupData;
}

const BackupCodesStep = ({
  onCompleted,
  twoFAData,
}: BackupCodesStepProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const backupCodesText = useMemo(
    () => twoFAData.backupCodes.join("\n"),
    [twoFAData.backupCodes],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(backupCodesText);
    toast.success(t("copied"));
  };

  const handleDownload = () => {
    const blob = new Blob([backupCodesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "spybee-backup-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    toast.success(t("enabled"));
    onCompleted();
    router.refresh();
  };

  if (twoFAData.backupCodes.length === 0) {
    return null;
  }

  return (
    <div className={styles.stepCard}>

      <ul className={styles.codes}>
        {twoFAData.backupCodes.map((backupCode) => (
          <li key={backupCode} className={styles.backupCode}>
            {backupCode}
          </li>
        ))}
      </ul>

      <div className={styles.backupActions}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          aria-label={t("copy_backup_codes")}
        >
          <MinaClipboard aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDownload}
          aria-label={t("download_backup_codes")}
        >
          <MinaDownload aria-hidden="true" />
        </Button>
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={handleFinish}>
          {tCommon("actions.finish")}
        </Button>
      </div>
    </div>
  );
};

export { BackupCodesStep };
