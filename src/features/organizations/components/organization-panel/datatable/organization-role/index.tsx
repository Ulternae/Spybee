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
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { updateOrganizationMemberRoleAction } from "@/features/organizations/actions/update-organization-member-role/update-organization-member-role.server";
import {
  ORGANIZATION_MEMBER_ROLES,
  type OrganizationMemberRole,
} from "@/features/organizations/lib/organization-member-roles";
import type { OrganizationDetailMember } from "@/features/organizations/queries/get-organization-detail";
import styles from "./organization-role.module.scss";
import { authClient } from "@/lib/auth/client";

interface OrganizationRoleCellProps {
  organizationId: string;
  canManageMembers: boolean;
  member: OrganizationDetailMember;
}

const getRoleLabelKey = (role: string) => {
  return `roles.${role}`;
};

const OrganizationRoleCell = ({ organizationId, canManageMembers, member }: OrganizationRoleCellProps) => {
  const t = useTranslations("organizations.detail");
  const router = useRouter();
  const { data } = authClient.useSession()

  const [role, setRole] = useState(member.role);
  const [isPending, setIsPending] = useState(false);

  const handleValueChange = async (nextRole: OrganizationMemberRole) => {
    if (isPending || nextRole === role) {
      return;
    }

    const previousRole = role;
    setRole(nextRole);
    setIsPending(true);

    try {
      const state = await updateOrganizationMemberRoleAction({
        organizationId,
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

  const isSameUser = data?.user?.id === member.user.id || !data

  if (!canManageMembers) {
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
        void handleValueChange(nextRole as OrganizationMemberRole);
      }}
    >
      <SelectTrigger disabled={isSameUser} size="sm" className={styles.trigger}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className={styles.content}>
        {ORGANIZATION_MEMBER_ROLES.map((roleOption) => (
          <SelectItem key={roleOption} value={roleOption}>
            {t(getRoleLabelKey(roleOption))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { OrganizationRoleCell };
