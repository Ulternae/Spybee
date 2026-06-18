"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { clientEnv } from "@/config/env.client";
import {
  CLUSTERS_LAYER_ID,
  INCIDENT_POINTS_LAYER_ID,
  INCIDENTS_SOURCE_ID,
} from "../../constants/mapbox-layers";
import { buildIncidentsGeoJSON } from "../../lib/build-incidents-geojson";
import { createIncidentMapLayers } from "../../lib/create-incident-map-layers";
import {
  getFeatureNumberProperty,
  getFeatureStringProperty,
  isMapboxPointFeature,
} from "../../lib/mapbox-feature";
import { registerIncidentMapIcons } from "../../lib/register-incident-map-icons";
import { createIncidentMapPopup } from "../incident-map-popup";
import type { MapIncident } from "../../queries/get-active-project-map";
import styles from "./mapbox-map.module.scss";

const DEFAULT_CENTER: [number, number] = [-74.0721, 4.711];
const DEFAULT_ZOOM = 13;

interface MapboxMapProps {
  incidents: MapIncident[];
  locale: string;
}

const MapboxMap = ({ incidents, locale }: MapboxMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const incidentsRef = useRef(incidents);
  const localeRef = useRef(locale);

  useEffect(() => {
    incidentsRef.current = incidents;
    localeRef.current = locale;
  }, [incidents, locale]);

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
        visualizePitch: true,
      }),
      "bottom-left",
    );

    const handleClusterClick = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [CLUSTERS_LAYER_ID],
      })[0];

      if (!isMapboxPointFeature(feature)) {
        return;
      }

      const clusterId = getFeatureNumberProperty(feature, "cluster_id");

      if (clusterId === null) {
        return;
      }

      const source = map.getSource(INCIDENTS_SOURCE_ID) as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (error, zoom) => {
        if (error || zoom === null || zoom === undefined) {
          return;
        }

        map.easeTo({
          center: feature.geometry.coordinates,
          zoom,
        });
      });
    };

    const handlePointClick = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [INCIDENT_POINTS_LAYER_ID],
      })[0];

      if (!isMapboxPointFeature(feature)) {
        return;
      }

      const incidentId = getFeatureStringProperty(feature, "id");
      const incident = incidentsRef.current.find((item) => item.id === incidentId);

      if (!incident) {
        return;
      }

      new mapboxgl.Popup({
        closeButton: false,
        offset: 16,
      })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(createIncidentMapPopup(incident, localeRef.current))
        .addTo(map);
    };

    const setPointerCursor = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const resetCursor = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("load", async () => {
      map.addSource(INCIDENTS_SOURCE_ID, {
        type: "geojson",
        data: buildIncidentsGeoJSON(incidentsRef.current),
        cluster: true,
        clusterMaxZoom: 17,
        clusterRadius: 28,
      });

      await registerIncidentMapIcons(map);

      createIncidentMapLayers().forEach((layer) => {
        map.addLayer(layer);
      });

      map.on("click", CLUSTERS_LAYER_ID, handleClusterClick);
      map.on("click", INCIDENT_POINTS_LAYER_ID, handlePointClick);
      map.on("mouseenter", CLUSTERS_LAYER_ID, setPointerCursor);
      map.on("mouseenter", INCIDENT_POINTS_LAYER_ID, setPointerCursor);
      map.on("mouseleave", CLUSTERS_LAYER_ID, resetCursor);
      map.on("mouseleave", INCIDENT_POINTS_LAYER_ID, resetCursor);
    });

    mapRef.current = map;

    return () => {
      map.off("click", CLUSTERS_LAYER_ID, handleClusterClick);
      map.off("click", INCIDENT_POINTS_LAYER_ID, handlePointClick);
      map.off("mouseenter", CLUSTERS_LAYER_ID, setPointerCursor);
      map.off("mouseenter", INCIDENT_POINTS_LAYER_ID, setPointerCursor);
      map.off("mouseleave", CLUSTERS_LAYER_ID, resetCursor);
      map.off("mouseleave", INCIDENT_POINTS_LAYER_ID, resetCursor);
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
      const source = map.getSource(INCIDENTS_SOURCE_ID) as
        | mapboxgl.GeoJSONSource
        | undefined;

      source?.setData(buildIncidentsGeoJSON(incidents));
    };

    if (map.getSource(INCIDENTS_SOURCE_ID)) {
      updateSource();
    } else {
      map.once("load", updateSource);
    }

    if (incidents.length === 0) {
      map.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    incidents.forEach((incident) => {
      bounds.extend([
        incident.longitude,
        incident.latitude,
      ]);
    });

    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 16,
      duration: 0,
    });
  }, [incidents]);

  return <div ref={containerRef} className={styles.root} />;
};

export { MapboxMap };
