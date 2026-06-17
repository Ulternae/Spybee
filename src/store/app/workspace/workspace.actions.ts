import { WorkspaceActions, WorkspaceSliceStore } from "./workspace.types";

const workspaceActions = (set: Parameters<WorkspaceSliceStore>[0], _get: Parameters<WorkspaceSliceStore>[0]): WorkspaceActions => ({

  hydrateWorkspace: (p) =>
    set(
      (state) => {
        state.activeOrganization = p.activeOrganization ?? state.activeOrganization;
        state.activeProject = p.activeProject ?? state.activeProject;
        state.organizations = p.organizations ?? state.organizations;
        state.projects = p.projects ?? state.projects;
        state.hasHydrated = true;
      },
      false,
      "workspace/hydrate",
    ),

  setActiveOrganization: ({ organization, projects }) =>
    set(
      (state) => {
        state.activeOrganization = organization;
        state.projects = projects;
        state.activeProject = null;
      },
      false,
      "workspace/setActiveOrganization",
    ),

  setActiveProject: ({ project }) =>
    set(
      (state) => {
        state.activeProject = project;
      },
      false,
      "workspace/setActiveProject",
    ),

  clearActiveProject: () =>
    set(
      (state) => {
        state.activeProject = null;
      },
      false,
      "workspace/clearActiveProject",
    ),

})

export { workspaceActions }