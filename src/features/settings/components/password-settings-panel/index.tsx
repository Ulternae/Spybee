"use client";

import { useState } from "react";
import { MinaLockKeyhole, MinaPassword } from "@zcorvus/icons-react";
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
import { ChangePasswordForm } from "./components/change-password-form";
import { SetPasswordForm } from "./components/set-password-form";
import styles from "./password-settings-panel.module.scss";

interface PasswordSettingsPanelProps {
  hasPassword: boolean;
}

const PasswordSettingsPanel = ({ hasPassword }: PasswordSettingsPanelProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("settings.security.password");

  const label = hasPassword ? t("change") : t("create");
  const description = hasPassword ? t("change_description") : t("create_description");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary" aria-label={label}>
              {hasPassword ? <MinaPassword /> : <MinaLockKeyhole />}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {hasPassword ? (
          <ChangePasswordForm onCompleted={() => setOpen(false)} />
        ) : (
          <SetPasswordForm onCompleted={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { PasswordSettingsPanel };
