import type { MapIncident } from "../queries/get-active-project-map";

type IncidentFeatureProperties = {
  id: string;
  status: string;
};

type IncidentFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: IncidentFeatureProperties;
};

type IncidentFeatureCollection = {
  type: "FeatureCollection";
  features: IncidentFeature[];
};

const buildIncidentsGeoJSON = (incidents: MapIncident[]): IncidentFeatureCollection => {
  return {
    type: "FeatureCollection",
    features: incidents.map<IncidentFeature>((incident) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [incident.longitude, incident.latitude],
      },
      properties: {
        id: incident.id,
        status: incident.status,
      },
    })),
  };
};

export { buildIncidentsGeoJSON };
export type { IncidentFeature, IncidentFeatureCollection };
