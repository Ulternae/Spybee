"use client";

import { useEffect, useState } from "react";
import { MinaEnvelope } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/client";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { cn } from "@/lib/utils/cn";
import styles from "./email-verification-panel.module.scss";

const COOLDOWN_SECONDS = 10;

interface EmailVerificationPanelProps {
  email: string;
  verified: boolean;
}

const EmailVerificationPanel = ({ email, verified }: EmailVerificationPanelProps) => {
  const t = useTranslations("settings.security.email_verification");
  const tError = useTranslations("error");
  const [cooldown, setCooldown] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleSendVerificationEmail = async () => {
    setIsPending(true);

    try {
      const { error } = await authClient.sendVerificationEmail({ email });

      if (error) {
        const errorCode = extractErrorCode(error);
        toast.error(tError.has(errorCode) ? tError(errorCode) : tError("GENERIC_ERROR"));
        return;
      }

      setCooldown(COOLDOWN_SECONDS);
      toast.success(t("sent"));
    } catch (error: unknown) {
      const errorCode = extractErrorCode(error);
      toast.error(tError.has(errorCode) ? tError(errorCode) : tError("GENERIC_ERROR"));
    } finally {
      setIsPending(false);
    }
  };

  const disabled = verified || isPending || cooldown > 0;
  const label = verified
    ? t("verified")
    : cooldown > 0
      ? t("cooldown", { seconds: cooldown })
      : t("send");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={styles.tooltipTrigger}>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={label}
            disabled={disabled}
            onClick={handleSendVerificationEmail}
            className={cn(verified && styles.verifiedIcon)}
          >
            <MinaEnvelope
              aria-hidden="true"
            />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export { EmailVerificationPanel };
