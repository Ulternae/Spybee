import { MapboxMap } from "../mapbox-map";
import styles from "./map-panel.module.scss";

const MapPanel = () => {

  return (
    <main className={styles.root}>
      <section className={styles.container}>
        <MapboxMap />
      </section>
    </main>
  );
};

export { MapPanel };
