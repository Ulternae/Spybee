import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { UserOrganization } from "../../queries/get-user-organizations";
import styles from "./organizations-panel.module.scss";

interface OrganizationsPanelProps {
  organizations: UserOrganization[];
}

const OrganizationsPanel = async ({
  organizations,
}: OrganizationsPanelProps) => {
  const t = await getTranslations("organizations.list");
  const tCommon = await getTranslations("common");

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
        {organizations.map((organization) => (
          <article className={styles.card} key={organization.id}>
            <div className={styles.cardTitle}>
              <h2>{organization.name}</h2>
              <p>{organization.slug}</p>
            </div>
            <div className={styles.meta}>
              <Badge variant="outline">{organization.role}</Badge>
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
        ))}
      </section>
    </main>
  );
};

export { OrganizationsPanel };
