"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { clientEnv } from "@/config/env.client";
import styles from "./mapbox-map.module.scss";

const DEFAULT_CENTER: [number, number] = [-74.0721, 4.711];
const DEFAULT_ZOOM = 13;

const MapboxMap = () => {
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
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "bottom-left",
    );

    mapRef.current = map;


    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={styles.root} />;
};

export { MapboxMap };
