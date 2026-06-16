"use client";

import { useState } from "react";
import { MinaShieldCheck, MinaShieldSlash } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TwoFactorDisableForm } from "./components/two-factor-disable-form";
import { TwoFactorEnableFlow } from "./components/two-factor-enable-flow";
import styles from "./two-factor-settings-panel.module.scss";

interface TwoFactorSettingsPanelProps {
  enabled: boolean;
  canManage: boolean;
}

const TwoFactorSettingsPanel = ({ enabled, canManage }: TwoFactorSettingsPanelProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("settings.security.two_factor");

  const label = enabled ? t("disable") : t("activate");
  const tooltip = !canManage
    ? t("requirements_tooltip")
    : enabled ? t("disable_tooltip") : t("activate_tooltip");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild disabled={!canManage}>
            <Button
              size="icon"
              variant="secondary"
              aria-label={label}
              disabled={!canManage}
            >
              {enabled ? <MinaShieldSlash /> : <MinaShieldCheck />}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {enabled ? t("disable_description") : t("setup_description")}
          </DialogDescription>
        </DialogHeader>

        {enabled ? (
          <TwoFactorDisableForm onCompleted={() => setOpen(false)} />
        ) : (
          <TwoFactorEnableFlow onCompleted={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { TwoFactorSettingsPanel };
