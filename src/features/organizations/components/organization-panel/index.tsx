"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { OrganizationDetail } from "../../queries/get-organization-detail";
import styles from "./organization-panel.module.scss";
import { Datatable } from "@/components/ui/data-table";
import { getOrganizationPanelColumns } from "./datatable/organization-panel.columns";
import { OrganizationAddMemberPopover } from "./organization-add-member-popover";

interface OrganizationPanelProps {
  data: OrganizationDetail;
}

const OrganizationPanel = ({ data }: OrganizationPanelProps) => {
  const t = useTranslations("organizations.detail");
  const columns = getOrganizationPanelColumns({
    organizationId: data.organization.id,
    canManageMembers: data.access.canManageMembers,
  });

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <div className={styles.headerTitle}>
            <h2>{data.organization.name}</h2>
            <Badge variant="secondary">
              {t("members_count", { count: data.members.length })}
            </Badge>
          </div>
          <p>{t("members_description")}</p>
        </div>
        {data.access.canManageMembers && (
          <OrganizationAddMemberPopover
            organizationId={data.organization.id}
            availableUsers={data.availableUsers}
          />
        )}
      </header>
      <section className={styles.section}>
        <Datatable
          columns={columns}
          data={data.members}
          searchableColumns={["user.email"]}
        />
      </section>
    </main>
  );
};

export { OrganizationPanel };
