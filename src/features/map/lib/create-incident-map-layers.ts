import type { LayerSpecification } from "mapbox-gl";
import {
  INCIDENT_STATUS_COLORS,
  INCIDENT_STATUS_COLORS_PASTEL,
  INCIDENT_STATUS_ICON_ASSETS,
} from "../constants/incident-map-style";
import {
  CLUSTER_COUNT_LAYER_ID,
  CLUSTERS_LAYER_ID,
  INCIDENT_POINTS_LAYER_ID,
  INCIDENTS_SOURCE_ID,
} from "../constants/mapbox-layers";

const createIncidentMapLayers = (): LayerSpecification[] => [
  {
    id: CLUSTERS_LAYER_ID,
    type: "circle",
    source: INCIDENTS_SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        INCIDENT_STATUS_COLORS_PASTEL.ON_PAUSE,
        10,
        INCIDENT_STATUS_COLORS_PASTEL.ON_PAUSE,
        25,
        INCIDENT_STATUS_COLORS_PASTEL.OPEN,
      ],
      "circle-radius": [
        "step",
        ["get", "point_count"],
        20,
        10,
        26,
        25,
        32,
      ],
      "circle-stroke-width": 3,
      "circle-stroke-color": [
        "step",
        ["get", "point_count"],
        INCIDENT_STATUS_COLORS.ON_PAUSE,
        10,
        INCIDENT_STATUS_COLORS.ON_PAUSE,
        25,
        INCIDENT_STATUS_COLORS.OPEN,
      ],
    },
  },
  {
    id: CLUSTER_COUNT_LAYER_ID,
    type: "symbol",
    source: INCIDENTS_SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#111827",
    },
  },
  {
    id: INCIDENT_POINTS_LAYER_ID,
    type: "symbol",
    source: INCIDENTS_SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": [
        "match",
        ["get", "status"],
        "OPEN",
        INCIDENT_STATUS_ICON_ASSETS.OPEN.id,
        "ON_PAUSE",
        INCIDENT_STATUS_ICON_ASSETS.ON_PAUSE.id,
        "CLOSED",
        INCIDENT_STATUS_ICON_ASSETS.CLOSED.id,
        INCIDENT_STATUS_ICON_ASSETS.OPEN.id,
      ],
      "icon-size": 0.65,
      "icon-anchor": "center",
      "icon-allow-overlap": false,
      "icon-ignore-placement": false,
      "icon-padding": 4,
    },
  },
];

export { createIncidentMapLayers };
