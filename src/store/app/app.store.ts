import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import type { WorkspaceSlice } from "./workspace/workspace.types";
import { createWorkspaceSlice } from "./workspace/workspace.slice";
import type { MapSlice } from "./map/map.types";
import { createMapSlice } from "./map/map.slice";

export type AppStoreState = WorkspaceSlice & MapSlice;

export const appStore = (initialState: Partial<AppStoreState> = {}) => {
  return create<AppStoreState>()(
    subscribeWithSelector(
      persist(
        devtools(
          immer((set, get, store) => ({
            ...createWorkspaceSlice(set, get, store),
            ...createMapSlice(set, get, store),
            ...initialState,
          })),
        ),
        {
          name: "spybee-map-state",
          partialize: (state) => ({
            mapViewportByProject: state.mapViewportByProject,
            incidentLocationDraftByProject: state.incidentLocationDraftByProject,
          }),
        },
      ),
    ),
  );
};

export type AppStore = ReturnType<typeof appStore>;
