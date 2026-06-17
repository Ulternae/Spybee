import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getInitialWorkspaceState } from "@/features/workspace/queries/get-initial-workspace-state";
import { AppStoreProvider } from "@/store/app/app.provider";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProps) => {
  const initialState = await getInitialWorkspaceState();

  return (
    <AppStoreProvider initialState={initialState}>
      <AppShell>{children}</AppShell>
    </AppStoreProvider>
  )
};

export default AppLayout;
