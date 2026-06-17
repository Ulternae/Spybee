import { workspaceActions } from "./workspace.actions";
import { initialWorkspaceState } from "./workspace.initial";
import type { WorkspaceSliceStore } from "./workspace.types";

const createWorkspaceSlice: WorkspaceSliceStore = (set, get) => ({
  ...initialWorkspaceState,
  ...workspaceActions(set, get)
});

export { createWorkspaceSlice };
