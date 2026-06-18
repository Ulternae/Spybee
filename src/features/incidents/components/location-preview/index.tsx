import { MapPreview } from "@/components/common/map-preview";
import styles from "./location-preview.module.scss";
import { useTranslations } from "next-intl";

type IncidentLocation = {
  latitude: number;
  longitude: number;
};

interface LocationPreviewProps {
  location: IncidentLocation;
}

const LocationPreview = ({ location }: LocationPreviewProps) => {
  const t = useTranslations("common.fields");

  return (
    <div className={styles.root}>
      <MapPreview location={location} />
      <div className={styles.content}>
        <span className={styles.marker} />
        <div>
          <p className={styles.label}>{t("location")}</p>
          <p className={styles.coordinates}>
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
};

export { LocationPreview };
export type { IncidentLocation };
