"use client";

import { useState } from "react";
import { MinaDotsVertical } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { useAppStore } from "@/store/app/app.provider";
import { setActiveOrganizationServerAction } from "../../actions/set-active-organization/set-active-organization.server";
import type { UserOrganization } from "../../queries/get-user-organizations";
import styles from "./organization-actions-menu.module.scss";

interface OrganizationActionsMenuProps {
  organization: UserOrganization;
  isActive: boolean;
  triggerClassName?: string;
}

const OrganizationActionsMenu = ({ organization, isActive, triggerClassName }: OrganizationActionsMenuProps) => {

  const t = useTranslations("organizations.list");
  const router = useRouter();
  const setActiveOrganization = useAppStore((state) => state.setActiveOrganization);

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSetDefault = async () => {
    if (isActive || isPending) {
      return;
    }

    setIsPending(true);

    try {
      const state = await setActiveOrganizationServerAction({
        organizationId: organization.id,
      });

      if (state.status !== FORM_STATUS.SUCCESS) {
        toast.error(t("set_default_error"));
        return;
      }

      setActiveOrganization({
        organization,
        projects: [],
      });
      toast.success(t("set_default_success"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("set_default_error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={triggerClassName}
          aria-label={t("actions_label")}
          disabled={isPending}
        >
          <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.content}>
        <DropdownMenuItem
          className={styles.item}
          disabled={isActive || isPending}
          onSelect={(event) => {
            event.preventDefault();
            void handleSetDefault();
          }}
        >
          {isPending ? t("setting_default") : t("set_default")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={styles.item}>
          <Link href={`/organizations/${organization.id}`}>
            {t("view_detail")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { OrganizationActionsMenu };
