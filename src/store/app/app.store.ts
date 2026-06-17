import { create, Mutate, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { WorkspaceSlice } from "./workspace/workspace.types";
import { createWorkspaceSlice } from "./workspace/workspace.slice";

export type AppStoreState = WorkspaceSlice;

export const appStore = (initialState: Partial<AppStoreState> = {}) => {
  return create<AppStoreState>()(
    subscribeWithSelector(
      devtools(
        immer((set, get, store) => ({
          ...createWorkspaceSlice(set, get, store),
          ...initialState,
        })),
      ),
    ),
  );
};

export type AppStore = ReturnType<typeof appStore>;