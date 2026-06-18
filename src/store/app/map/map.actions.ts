import type { MapActions, MapSliceStore } from "./map.types";

const mapActions = (
  set: Parameters<MapSliceStore>[0],
): MapActions => ({
  setMapViewport: ({ projectId, viewport }) =>
    set(
      (state) => {
        state.mapViewportByProject[projectId] = viewport;
      },
      false,
      "map/setMapViewport",
    ),

  setIncidentLocationDraft: ({ projectId, location }) =>
    set(
      (state) => {
        state.incidentLocationDraftByProject[projectId] = location;
      },
      false,
      "map/setIncidentLocationDraft",
    ),

  clearIncidentLocationDraft: ({ projectId }) =>
    set(
      (state) => {
        delete state.incidentLocationDraftByProject[projectId];
      },
      false,
      "map/clearIncidentLocationDraft",
    ),
});

export { mapActions };
