import type { WorkspaceState } from "./workspace.types";

export const initialWorkspaceState: WorkspaceState = {
  activeOrganization: null,
  activeProject: null,
  organizations: [],
  projects: [],
  hasHydrated: false,
};