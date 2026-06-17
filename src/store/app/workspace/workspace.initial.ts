import type { WorkspaceState } from "./workspace.types";

export const initialWorkspaceState: WorkspaceState = {
  isAuthenticated: false,
  activeOrganization: null,
  activeProject: null,
  organizations: [],
  projects: [],
  hasHydrated: false,
};
