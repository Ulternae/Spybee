import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <AppShell>{children}</AppShell>;
};

export default DashboardLayout;
