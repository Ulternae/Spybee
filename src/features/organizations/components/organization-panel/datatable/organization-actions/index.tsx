"use client";

import { useState } from "react";
import { MinaDotsVertical } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { removeOrganizationMemberAction } from "@/features/organizations/actions/remove-organization-member/remove-organization-member.server";
import type { OrganizationDetailMember } from "@/features/organizations/queries/get-organization-detail";
import styles from "./organization-actions.module.scss";

interface OrganizationActionsCellProps {
  organizationId: string;
  canManageMembers: boolean;
  member: OrganizationDetailMember;
}

const OrganizationActionsCell = ({
  organizationId,
  canManageMembers,
  member,
}: OrganizationActionsCellProps) => {
  const t = useTranslations("organizations.detail");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleRemoveMember = async () => {
    if (isPending || !canManageMembers) {
      return;
    }

    setIsPending(true);

    try {
      const state = await removeOrganizationMemberAction({
        organizationId,
        userId: member.user.id,
      });

      if (state.status !== FORM_STATUS.SUCCESS) {
        toast.error(t("remove_member_error"));
        return;
      }

      toast.success(t("remove_member_success"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("remove_member_error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={styles.root} asChild>
        <Button
          className={styles.trigger}
          size="icon"
          variant="ghost"
          aria-label={t("remove_member")}
          disabled={isPending || !canManageMembers}
        >
          <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.content}>
        <DropdownMenuItem
          className={styles.item}
          disabled={isPending || !canManageMembers}
          onSelect={(event) => {
            event.preventDefault();
            void handleRemoveMember();
          }}
        >
          {isPending ? t("removing_member") : t("remove_member")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { OrganizationActionsCell };
