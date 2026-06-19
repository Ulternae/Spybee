"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { ProjectDetail } from "../../queries/get-project-detail";
import { getProjectPanelColumns } from "./datatable/project-panel.columns";
import { ProjectAddMemberPopover } from "./project-add-member-popover";
import styles from "./project-panel.module.scss";

interface ProjectPanelProps {
  data: ProjectDetail;
}

const ProjectPanel = ({ data }: ProjectPanelProps) => {
  const t = useTranslations("projects.detail");
  const columns = getProjectPanelColumns({
    projectId: data.project.id,
    canManageProjectMembers: data.access.canManageProjectMembers,
  });

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <div className={styles.headerTitle}>
            <h2>{data.project.name}</h2>
            <Badge variant="secondary">
              {t("members_count", { count: data.members.length })}
            </Badge>
            <Badge variant="outline">
              {t("incidents_count", { count: data.project.incidentsCount })}
            </Badge>
          </div>
          <p>
            {t("members_description", {
              organization: data.organization.name,
            })}
          </p>
        </div>
        {data.access.canManageProjectMembers && (
          <ProjectAddMemberPopover
            projectId={data.project.id}
            availableUsers={data.availableUsers}
          />
        )}
      </header>

      <section className={styles.section}>
        <DataTable
          columns={columns}
          data={data.members}
          searchableColumns={["user.email", "user.name"]}
        />
      </section>
    </main>
  );
};

export { ProjectPanel };
