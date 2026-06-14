"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import styles from "./app-shell.module.scss";

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className={styles.content}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
