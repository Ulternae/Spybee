"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { clientEnv } from "@/config/env.client";
import styles from "./map-preview.module.scss";

type MapPreviewLocation = {
  latitude: number;
  longitude: number;
};

interface MapPreviewProps {
  location: MapPreviewLocation;
  zoom?: number;
}

const MapPreview = ({ location, zoom = 16 }: MapPreviewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = clientEnv.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [location.longitude, location.latitude],
      zoom,
      interactive: false,
      attributionControl: false,
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

    map.easeTo({
      center: [location.longitude, location.latitude],
      zoom,
      duration: 0,
    });
  }, [location.latitude, location.longitude, zoom]);

  return (
    <div className={styles.root}>
      <div ref={containerRef} className={styles.map} />
      <span className={styles.marker} aria-hidden="true" />
    </div>
  );
};

export { MapPreview };
export type { MapPreviewLocation, MapPreviewProps };
