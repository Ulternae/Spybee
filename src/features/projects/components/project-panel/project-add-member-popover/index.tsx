"use client";

import { useState } from "react";
import { MinaUsers } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/common/user-avatar";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { addProjectMemberAction } from "@/features/projects/actions/add-project-member/add-project-member.server";
import type { ProjectDetailUser } from "@/features/projects/queries/get-project-detail";
import styles from "./project-add-member-popover.module.scss";

interface ProjectAddMemberPopoverProps {
  projectId: string;
  availableUsers: ProjectDetailUser[];
}

const ProjectAddMemberPopover = ({ projectId, availableUsers }: ProjectAddMemberPopoverProps) => {

  const t = useTranslations("projects.detail");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const handleAddMember = async (userId: string) => {
    if (pendingUserId) {
      return;
    }

    setPendingUserId(userId);

    try {
      const state = await addProjectMemberAction({
        projectId,
        userId,
      });

      if (state.status !== FORM_STATUS.SUCCESS) {
        toast.error(t("add_member_error"));
        return;
      }

      toast.success(t("add_member_success"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("add_member_error"));
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm">
          {t("add_member")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className={styles.content}>
        <div className={styles.header}>
          <h3>{t("available_users_title")}</h3>
          <p>{t("available_users_description")}</p>
        </div>

        {availableUsers.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("available_users_empty")}</p>
          </div>
        ) : (
          <div className={styles.list}>
            {availableUsers.map((user) => {
              const isPending = pendingUserId === user.id;

              return (
                <button
                  key={user.id}
                  type="button"
                  className={styles.user}
                  disabled={!!pendingUserId}
                  onClick={() => {
                    void handleAddMember(user.id);
                  }}
                >
                  <UserAvatar
                    size="sm"
                    name={user.name}
                    image={user.image}
                  />
                  <span className={styles.userInfo}>
                    <span>{user.name}</span>
                    <small>{user.email}</small>
                  </span>
                  <span className={styles.action}>
                    {isPending ? t("adding_member") : <MinaUsers />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { ProjectAddMemberPopover };
