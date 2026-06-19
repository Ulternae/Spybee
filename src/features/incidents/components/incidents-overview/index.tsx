"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import type { IncidentsOverviewMetric } from "../../queries/get-incidents-overview";
import styles from "./incidents-overview.module.scss";

interface IncidentsOverviewProps {
  metrics: IncidentsOverviewMetric[];
}

const IncidentsOverview = ({ metrics }: IncidentsOverviewProps) => {
  const t = useTranslations("incidents.overview.metrics");

  return (
    <section className={styles.root} aria-label={t("label")}>
      {metrics.map((metric) => (
        <Card
          key={metric.key}
          className={styles.card}
          data-tone={metric.tone}
        >
          <CardContent className={styles.content}>
            <div className={styles.valueLine}>
              <strong>{metric.value}</strong>
              <span className={styles.label}>{t(`${metric.key}.label`)}</span>
            </div>
            <span className={styles.description}>
              {t(`${metric.key}.description`)}
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export { IncidentsOverview };
export type { IncidentsOverviewProps };
