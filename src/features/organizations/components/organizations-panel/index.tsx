"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import type { UserOrganization } from "../../queries/get-user-organizations";
import { OrganizationActionsMenu } from "../organization-actions-menu";
import styles from "./organizations-panel.module.scss";

interface OrganizationsPanelProps {
  organizations: UserOrganization[];
  activeOrganizationId?: string | null;
}

const OrganizationsPanel = ({ organizations, activeOrganizationId }: OrganizationsPanelProps) => {
  const t = useTranslations("organizations.list");
  const tRole = useTranslations("organizations.detail.roles");

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/organizations/new">{t("new_action")}</Link>
        </Button>
      </header>

      <section className={styles.list} aria-label={t("title")}>
        {organizations.map((organization) => {
          const isActive = organization.id === activeOrganizationId;

          return (
            <article
              className={cn(styles.card, isActive && styles.cardActive)}
              key={organization.id}
              aria-current={isActive ? "true" : undefined}
            >
              <OrganizationActionsMenu
                organization={organization}
                isActive={isActive}
                triggerClassName={styles.cardButton}
              />
              <div className={styles.cardTitle}>
                <h2>{organization.name}</h2>
                <p>{organization.slug}</p>
              </div>
              <div className={styles.meta}>
                <Badge variant="outline">{tRole(organization.role)}</Badge>
                <Badge variant="secondary">
                  {t("projects_count", {
                    count: organization.projectsCount,
                  })}
                </Badge>
                <Badge variant="secondary">
                  {t("members_count", {
                    count: organization.membersCount,
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

export { OrganizationsPanel };
