"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ProjectListItem } from "../../queries/get-active-organization-projects";
import styles from "./projects-panel.module.scss";
import { useAppStore } from "@/store/app/app.provider";

interface ProjectsPanelProps {
  projects: ProjectListItem[];
}

const ProjectsPanel = ({ projects }: ProjectsPanelProps) => {

  const t = useTranslations("projects.list");
  const organization = useAppStore((state) => state.activeOrganization)
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
        {projects.map((project) => (
          <article className={styles.card} key={project.id}>
            <div className={styles.cardTitle}>
              <h2>{project.name}</h2>
              <p>{project.slug}</p>
            </div>
            <div className={styles.meta}>
              {project.role && <Badge variant="outline">{project.role}</Badge>}
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
        ))}
      </section>
    </main>
  );
};

export { ProjectsPanel };
