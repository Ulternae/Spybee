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
import { removeProjectMemberAction } from "@/features/projects/actions/remove-project-member/remove-project-member.server";
import type { ProjectDetailMember } from "@/features/projects/queries/get-project-detail";
import styles from "./project-actions.module.scss";

interface ProjectActionsCellProps {
  projectId: string;
  canManageProjectMembers: boolean;
  member: ProjectDetailMember;
}

const ProjectActionsCell = ({ projectId, canManageProjectMembers, member }: ProjectActionsCellProps) => {

  const t = useTranslations("projects.detail");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleRemoveMember = async () => {
    if (isPending || !canManageProjectMembers) {
      return;
    }

    setIsPending(true);

    try {
      const state = await removeProjectMemberAction({
        projectId,
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
          disabled={isPending || !canManageProjectMembers}
        >
          <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.content}>
        <DropdownMenuItem
          className={styles.item}
          disabled={isPending || !canManageProjectMembers}
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

export { ProjectActionsCell };
