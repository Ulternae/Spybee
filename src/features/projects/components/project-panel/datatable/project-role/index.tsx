"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { updateProjectMemberRoleAction } from "@/features/projects/actions/update-project-member-role/update-project-member-role.server";
import {
  PROJECT_MEMBER_ROLES,
  type ProjectRoleType,
} from "@/features/projects/lib/project-member-roles";
import type { ProjectDetailMember } from "@/features/projects/queries/get-project-detail";
import styles from "./project-role.module.scss";

interface ProjectRoleCellProps {
  projectId: string;
  canManageProjectMembers: boolean;
  member: ProjectDetailMember;
}

const getRoleLabelKey = (role: string) => {
  return `roles.${role}`;
};

const ProjectRoleCell = ({ projectId, canManageProjectMembers, member }: ProjectRoleCellProps) => {

  const t = useTranslations("projects.detail");
  const router = useRouter();
  const { data } = authClient.useSession();
  const [role, setRole] = useState<ProjectRoleType>(member.role);
  const [isPending, setIsPending] = useState(false);

  const handleValueChange = async (nextRole: ProjectRoleType) => {

    if (isPending || nextRole === role) {
      return;
    }

    const previousRole = role;
    setRole(nextRole);
    setIsPending(true);

    try {
      const state = await updateProjectMemberRoleAction({
        projectId,
        userId: member.user.id,
        role: nextRole,
      });

      if (state.status !== FORM_STATUS.SUCCESS) {
        setRole(previousRole);
        toast.error(t("update_role_error"));
        return;
      }

      toast.success(t("update_role_success"));
      router.refresh();
    } catch {
      setRole(previousRole);
      toast.error(t("update_role_error"));
    } finally {
      setIsPending(false);
    }
  };

  const isSameUser = data?.user?.id === member.user.id || !data;

  if (!canManageProjectMembers) {
    return (
      <p className={styles.text}>
        {t(getRoleLabelKey(member.role))}
      </p>
    );
  }

  return (
    <Select
      value={role}
      disabled={isPending}
      onValueChange={(nextRole) => {
        void handleValueChange(nextRole as ProjectRoleType);
      }}
    >
      <SelectTrigger
        disabled={isSameUser}
        size="sm"
        className={styles.trigger}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className={styles.content}>
        {PROJECT_MEMBER_ROLES.map((roleOption) => (
          <SelectItem key={roleOption} value={roleOption}>
            {t(getRoleLabelKey(roleOption))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { ProjectRoleCell };
