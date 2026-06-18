import type { Store } from "@/store/types";
import type { AppStoreState } from "../app.store";

type MapViewport = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type IncidentLocationDraft = {
  longitude: number;
  latitude: number;
};

type MapViewportByProject = Record<string, MapViewport>;
type IncidentLocationDraftByProject = Record<string, IncidentLocationDraft>;

type SetMapViewport = {
  projectId: string;
  viewport: MapViewport;
};

type SetIncidentLocationDraft = {
  projectId: string;
  location: IncidentLocationDraft;
};

type ClearIncidentLocationDraft = {
  projectId: string;
};

export type MapState = {
  mapViewportByProject: MapViewportByProject;
  incidentLocationDraftByProject: IncidentLocationDraftByProject;
};

export type MapActions = {
  setMapViewport: (p: SetMapViewport) => void;
  setIncidentLocationDraft: (p: SetIncidentLocationDraft) => void;
  clearIncidentLocationDraft: (p: ClearIncidentLocationDraft) => void;
};

export type MapSlice = MapState & MapActions;
export type MapSliceStore = Store<AppStoreState, MapSlice>;
export type {
  ClearIncidentLocationDraft,
  IncidentLocationDraft,
  MapViewport,
  SetIncidentLocationDraft,
  SetMapViewport,
};
