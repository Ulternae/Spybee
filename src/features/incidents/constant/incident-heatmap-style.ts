import type { CircleLayerSpecification, HeatmapLayerSpecification, } from "mapbox-gl";

const INCIDENT_HEATMAP_LAYER_PAINT = {
  "heatmap-weight": [
    "interpolate",
    ["linear"],
    ["get", "weight"],
    0,
    0,
    1,
    1,
  ],
  "heatmap-intensity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    0.9,
    16,
    1.6,
  ],
  "heatmap-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    16,
    16,
    42,
  ],
  "heatmap-opacity": 0.8,
  "heatmap-color": [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(242, 201, 76, 0)",
    0.25,
    "rgba(242, 201, 76, 0.75)",
    0.55,
    "rgba(245, 158, 11, 0.85)",
    0.85,
    "rgba(239, 68, 68, 0.9)",
    1,
    "rgba(127, 29, 29, 0.95)",
  ],
} satisfies NonNullable<HeatmapLayerSpecification["paint"]>;

const INCIDENT_HEATMAP_POINT_LAYER_PAINT = {
  "circle-radius": 5,
  "circle-color": "#f2c94c",
  "circle-stroke-color": "#ffffff",
  "circle-stroke-width": 2,
} satisfies NonNullable<CircleLayerSpecification["paint"]>;

export { INCIDENT_HEATMAP_LAYER_PAINT, INCIDENT_HEATMAP_POINT_LAYER_PAINT };