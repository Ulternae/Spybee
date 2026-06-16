"use client";

import { useTranslations } from "next-intl";
import { MinaLockKeyhole, MinaPassword } from "@zcorvus/icons-react";

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

import { PasswordSettingsForm } from "../password-settings-form";

import styles from "./password-settings-dialog.module.scss";
import { useState } from "react";

interface PasswordSettingsDialogProps {
  hasPassword: boolean;
}

const PasswordSettingsDialog = ({ hasPassword }: PasswordSettingsDialogProps) => {

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

      <DialogContent className={styles.content}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <PasswordSettingsForm
          hasPassword={hasPassword}
          onCompleted={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export { PasswordSettingsDialog };