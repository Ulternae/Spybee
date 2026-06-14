"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { AppPreferences } from "@/components/common/app-preferences";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./app-header.module.scss";

const formatSegmentLabel = (segment: string) => {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const AppHeader = () => {
  const pathname = usePathname();
  const tRoutes = useTranslations("common.routes");
  const tSidebar = useTranslations("common.sidebar");
  const segments = pathname.split("/").filter(Boolean);
  const items = [
    {
      href: "/",
      label: tRoutes.has("dashboard") ? tRoutes("dashboard") : "Dashboard",
    },
    ...segments.map((segment, index) => {
      const labelKey = segment.replace(/-/g, "_");

      return {
        href: `/${segments.slice(0, index + 1).join("/")}`,
        label: tRoutes.has(labelKey)
          ? tRoutes(labelKey)
          : formatSegmentLabel(segment),
      };
    }),
  ];

  return (
    <header className={styles.topbar}>
      <div className={styles.navigation}>
        <SidebarTrigger label={tSidebar("toggle")} />
        <Separator
          orientation="vertical"
          className={styles.navigationSeparator}
        />
        <Breadcrumb className={styles.breadcrumb}>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <Fragment key={item.href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AppPreferences />
    </header>
  );
}

export { AppHeader };
