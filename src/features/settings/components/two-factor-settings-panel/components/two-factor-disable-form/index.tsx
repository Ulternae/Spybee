"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input-password";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";
import styles from "../../two-factor-settings-panel.module.scss";

interface TwoFactorDisableFormProps {
  onCompleted: () => void;
}

const TwoFactorDisableForm = ({ onCompleted }: TwoFactorDisableFormProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");
  const tError = useTranslations("error");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const errorMessage = useMemo(() => {
    if (!errorCode) {
      return null;
    }

    return tError.has(errorCode) ? tError(errorCode) : tError("GENERIC_ERROR");
  }, [errorCode, tError]);

  const handleDisable = async () => {
    setErrorCode(null);
    setIsPending(true);

    try {
      const { error } = await authClient.twoFactor.disable({ password });

      if (error) {
        setErrorCode(extractErrorCode(error));
        return;
      }

      toast.success(t("disabled"));
      onCompleted();
      router.refresh();
    } catch (error: unknown) {
      setErrorCode(extractErrorCode(error));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={styles.flow}>
      <InputPassword
        name="twoFactorPassword"
        autoComplete="current-password"
        placeholder={tCommon("fields.currentPassword")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isPending}
      />

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDisable}
          disabled={isPending || !password}
        >
          {isPending ? tCommon("actions.loading") : t("disable")}
        </Button>
      </div>
    </div>
  );
};

export { TwoFactorDisableForm };
