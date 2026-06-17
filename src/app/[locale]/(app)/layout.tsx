import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppStoreProvider } from "@/store/app/app.provider";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <AppStoreProvider>
      <AppShell>{children}</AppShell>
    </AppStoreProvider>
  )
};

export default AppLayout;
