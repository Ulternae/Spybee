"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ProjectListItem } from "../../queries/get-active-organization-projects";
import styles from "./projects-panel.module.scss";
import { useAppStore } from "@/store/app/app.provider";
import { ProjectsActionsMenu } from "../projects-actions-menu";
import { cn } from "@/lib/utils/cn";

interface ProjectsPanelProps {
  projects: ProjectListItem[];
}

const ProjectsPanel = ({ projects }: ProjectsPanelProps) => {

  const t = useTranslations("projects.list");
  const tRole = useTranslations("projects.detail.roles");
  const organization = useAppStore((state) => state.activeOrganization)
  const activeProject = useAppStore((state) => state.activeProject)
  const organizationName = organization?.name ?? t("active_organization_fallback");

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2>{t("title")}</h2>
          <p>{t("description", { organization: organizationName })}</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">{t("new_action")}</Link>
        </Button>
      </header>

      <section className={styles.list} aria-label={t("title")}>
        {projects.map((project) => {
          const isActive = project.id === activeProject?.id;

          return (
            <article
              className={cn(styles.card, isActive && styles.cardActive)}
              key={project.id}
              aria-current={isActive ? "true" : undefined}
            >
              <ProjectsActionsMenu
                project={project}
                isActive={isActive}
                triggerClassName={styles.cardButton}
              />
              <div className={styles.cardTitle}>
                <h2>{project.name}</h2>
                <p>{project.slug}</p>
              </div>
              <div className={styles.meta}>
                {project.role && <Badge variant="outline">{tRole(project.role)}</Badge>}
                <Badge variant="secondary">
                  {t("incidents_count", {
                    count: project.incidentsCount,
                  })}
                </Badge>
                <Badge variant="secondary">
                  {t("members_count", {
                    count: project.membersCount,
                  })}
                </Badge>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export { ProjectsPanel };
