import type { Store } from "@/store/types";
import type { AppStoreState } from "../app.store";

type WorkspaceOrganization = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

type WorkspaceProject = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
};

type HydrateWorkspace = {
  isAuthenticated?: boolean;
  activeOrganization?: WorkspaceOrganization | null;
  activeProject?: WorkspaceProject | null;
  organizations?: WorkspaceOrganization[];
  projects?: WorkspaceProject[];
};

type SetActiveOrganization = {
  organization: WorkspaceOrganization | null;
  projects: WorkspaceProject[];
};

type SetActiveProject = {
  project: WorkspaceProject | null;
};

export type WorkspaceState = {
  isAuthenticated: boolean;
  activeOrganization: WorkspaceOrganization | null;
  activeProject: WorkspaceProject | null;
  organizations: WorkspaceOrganization[];
  projects: WorkspaceProject[];
  hasHydrated: boolean;
};

export type WorkspaceActions = {
  hydrateWorkspace: (p: HydrateWorkspace) => void;
  setActiveOrganization: (p: SetActiveOrganization) => void;
  setActiveProject: (p: SetActiveProject) => void;
  clearActiveProject: () => void;
};

export type WorkspaceSlice = WorkspaceState & WorkspaceActions;
export type WorkspaceSliceStore = Store<AppStoreState, WorkspaceSlice>;
