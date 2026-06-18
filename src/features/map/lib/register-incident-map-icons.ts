import type mapboxgl from "mapbox-gl";
import { INCIDENT_STATUS_ICON_ASSETS } from "../constants/incident-map-style";

const registerIncidentMapIcons = async (map: mapboxgl.Map) => {
  await Promise.all(
    Object.values(INCIDENT_STATUS_ICON_ASSETS).map((asset) => {
      return new Promise<void>((resolve) => {
        if (map.hasImage(asset.id)) {
          resolve();
          return;
        }

        map.loadImage(asset.path, (error, image) => {
          if (!error && image && !map.hasImage(asset.id)) {
            map.addImage(asset.id, image);
          }

          resolve();
        });
      });
    }),
  );
};

export { registerIncidentMapIcons };
