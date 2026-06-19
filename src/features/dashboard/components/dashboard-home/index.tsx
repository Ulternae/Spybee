"use client";

import {
  MinaBuilding,
  MinaClipboard,
  MinaFolderKanban,
  MinaMap,
  MinaUserSettings,
} from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/store/app/app.provider";
import styles from "./dashboard-home.module.scss";
import type { NavigationIcon } from "@/components/layout/app-sidebar/app-sidebar.types";

type DashboardRoute = {
  key: "organizations" | "projects" | "incidents" | "map" | "settings";
  href: string;
  icon: NavigationIcon;
  requiresAuth?: boolean;
  requiresOrganization?: boolean;
  requiresProject?: boolean;
};

const DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    key: "organizations",
    href: "/organizations",
    icon: MinaBuilding,
    requiresAuth: true,
  },
  {
    key: "projects",
    href: "/projects",
    icon: MinaFolderKanban,
    requiresAuth: true,
    requiresOrganization: true,
  },
  {
    key: "incidents",
    href: "/incidents",
    icon: MinaClipboard,
    requiresAuth: true,
    requiresOrganization: true,
    requiresProject: true,
  },
  {
    key: "map",
    href: "/map",
    icon: MinaMap,
    requiresAuth: true,
    requiresOrganization: true,
    requiresProject: true,
  },
  {
    key: "settings",
    href: "/settings",
    icon: MinaUserSettings,
    requiresAuth: true,
  },
];

const DashboardHome = () => {
  const t = useTranslations("dashboard");
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const hasActiveOrganization = useAppStore((state) =>
    Boolean(state.activeOrganization),
  );
  const hasActiveProject = useAppStore((state) => Boolean(state.activeProject));

  const isRouteDisabled = (route: DashboardRoute) => {
    if (route.requiresAuth && !isAuthenticated) {
      return true;
    }

    if (route.requiresOrganization && !hasActiveOrganization) {
      return true;
    }

    if (route.requiresProject && !hasActiveProject) {
      return true;
    }

    return false;
  };

  return (
    <main className={styles.root}>
      <header className={styles.hero}>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>

      <section className={styles.routes} aria-label={t("routes_label")}>
        {DASHBOARD_ROUTES.map((route) => {
          const Icon = route.icon;
          const disabled = isRouteDisabled(route);
          const card = (
            <Card
              className={cn(styles.card, disabled && styles.disabled)}
              aria-disabled={disabled}
            >
              <CardContent className={styles.cardContent}>
                <span className={styles.icon}>
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`routes.${route.key}.title`)}</strong>
                  <p>{t(`routes.${route.key}.description`)}</p>
                </span>
              </CardContent>
            </Card>
          );

          if (disabled) {
            return (
              <div key={route.key} className={styles.cardWrapper}>
                {card}
              </div>
            );
          }

          return (
            <Link key={route.key} href={route.href} className={styles.cardLink}>
              {card}
            </Link>
          );
        })}
      </section>
    </main>
  );
};

export { DashboardHome };
