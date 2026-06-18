import type { Feature, Geometry, Point } from "geojson";

type FeaturePropertyValue = string | number | boolean | null | undefined;
type FeatureProperties = Record<string, FeaturePropertyValue>;
type MapboxFeature = Feature<Geometry, FeatureProperties | null>;

type MapboxPointFeature = Feature<Point, FeatureProperties> & {
  geometry: Point & {
    coordinates: [number, number];
  };
  properties: FeatureProperties;
};

const isMapboxPointFeature = (feature: MapboxFeature | undefined): feature is MapboxPointFeature => {
  if (!feature || !feature.properties || feature.geometry.type !== "Point") {
    return false;
  }

  const { coordinates } = feature.geometry;

  return (
    Array.isArray(coordinates) &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  );
};

const getFeatureStringProperty = (feature: MapboxPointFeature, property: string) => {
  const value = feature.properties[property];

  return typeof value === "string" ? value : null;
};

const getFeatureNumberProperty = (feature: MapboxPointFeature, property: string) => {
  const value = feature.properties[property];

  return typeof value === "number" ? value : null;
};

export {
  getFeatureNumberProperty,
  getFeatureStringProperty,
  isMapboxPointFeature,
};

export type { MapboxFeature, MapboxPointFeature };