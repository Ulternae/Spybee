"use client";

import { useTranslations } from "next-intl";
import {
  IncidenceRadarChart,
  IncidenceTreemapChart,
  IncidenceTrendChart,
} from "@/components/ui/analytics-charts";
import type { IncidentsAnalytics } from "../../queries/get-incidents-analytics";
import styles from "./incidents-analytics-panel.module.scss";

interface IncidentsAnalyticsPanelProps {
  analytics: IncidentsAnalytics;
}

const IncidentsAnalyticsPanel = ({ analytics }: IncidentsAnalyticsPanelProps) => {
  const t = useTranslations("incidents.analytics");

  return (
    <section className={styles.root} aria-label={t("title")}>
      <header className={styles.header}>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </header>

      <div className={styles.grid}>
        <IncidenceRadarChart
          data={analytics.categoryDistribution}
          title={t("category.title")}
          seriesName={t("series.incidents")}
        />

        <IncidenceTreemapChart
          data={analytics.tagDistribution}
          title={t("tags.title")}
        />
      </div>

      <IncidenceTrendChart
        data={analytics.trend}
        title={t("trend.title")}
        seriesLabels={{
          backlog: t("trend.series.backlog"),
          created: t("trend.series.created"),
          closed: t("trend.series.closed"),
        }}
      />
    </section>
  );
};

export { IncidentsAnalyticsPanel };
export type { IncidentsAnalyticsPanelProps };
