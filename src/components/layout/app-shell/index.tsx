"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AppearanceSwitcher } from "@/components/controllers/AppearanceSwitcher";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import styles from "./app-shell.module.scss";

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const tSidebar = useTranslations("common.sidebar");
  const tRoutes = useTranslations("common.routes");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className={styles.topbar}>
          <SidebarTrigger label={tSidebar("toggle")} />
          <div className={styles.topbarTitle}>
            <span>{tRoutes("dashboard")}</span>
          </div>
          <AppearanceSwitcher />
        </header>
        <div className={styles.content}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
