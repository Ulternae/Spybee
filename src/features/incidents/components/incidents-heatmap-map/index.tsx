"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { clientEnv } from "@/config/env.client";
import type { IncidentHeatmapPoint } from "../../queries/get-incidents-activity";
import styles from "./incidents-heatmap-map.module.scss";
import { HEATMAP_LAYER_ID, HEATMAP_POINTS_LAYER_ID, HEATMAP_SOURCE_ID } from "../../constant/mapbox-layers";
import { INCIDENT_HEATMAP_LAYER_PAINT, INCIDENT_HEATMAP_POINT_LAYER_PAINT } from "../../constant/incident-heatmap-style";

const DEFAULT_CENTER: [number, number] = [-74.0721, 4.711];
const DEFAULT_ZOOM = 13;

interface IncidentsHeatmapMapProps {
  points: IncidentHeatmapPoint[];
}

const buildHeatmapGeoJSON = (points: IncidentHeatmapPoint[]) => ({
  type: "FeatureCollection" as const,
  features: points.map((point) => ({
    type: "Feature" as const,
    properties: {
      id: point.id,
      weight: point.priority === "HIGH" ? 1 : 0.65,
    },
    geometry: {
      type: "Point" as const,
      coordinates: [point.longitude, point.latitude],
    },
  })),
});

const IncidentsHeatmapMap = ({ points }: IncidentsHeatmapMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const pointsRef = useRef(points);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = clientEnv.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      "bottom-right",
    );

    map.on("load", () => {
      map.addSource(HEATMAP_SOURCE_ID, {
        type: "geojson",
        data: buildHeatmapGeoJSON(pointsRef.current),
      });

      map.addLayer({
        id: HEATMAP_LAYER_ID,
        type: "heatmap",
        source: HEATMAP_SOURCE_ID,
        maxzoom: 18,
        paint: INCIDENT_HEATMAP_LAYER_PAINT,
      });

      map.addLayer({
        id: HEATMAP_POINTS_LAYER_ID,
        type: "circle",
        source: HEATMAP_SOURCE_ID,
        paint: INCIDENT_HEATMAP_POINT_LAYER_PAINT,
      });
    });


    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const updateSource = () => {
      const source = map.getSource(HEATMAP_SOURCE_ID) as
        | mapboxgl.GeoJSONSource
        | undefined;

      source?.setData(buildHeatmapGeoJSON(points));
    };

    if (map.getSource(HEATMAP_SOURCE_ID)) {
      updateSource();
    } else {
      map.once("load", updateSource);
    }

    if (points.length === 0) {
      map.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 0,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    points.forEach((point) => {
      bounds.extend([point.longitude, point.latitude]);
    });

    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 15,
      duration: 0,
    });
  }, [points]);

  return <div ref={containerRef} className={styles.root} />;
};

export { IncidentsHeatmapMap };
export type { IncidentsHeatmapMapProps };
