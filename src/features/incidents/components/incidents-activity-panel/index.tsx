"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ActivityCalendar } from "../activity-calendar";
import { IncidentsHeatmapMap } from "../incidents-heatmap-map";
import type { IncidentsActivity } from "../../queries/get-incidents-activity";
import styles from "./incidents-activity-panel.module.scss";
import { MinaMap } from "@zcorvus/icons-react";

interface IncidentsActivityPanelProps {
  activity: IncidentsActivity;
}

const IncidentsActivityPanel = ({ activity }: IncidentsActivityPanelProps) => {
  const t = useTranslations("incidents.activity");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const heatmapPoints = useMemo(() => {
    if (!selectedDate) {
      return activity.heatmapPoints;
    }

    return activity.heatmapPoints.filter((point) => point.createdDate === selectedDate);
  }, [activity.heatmapPoints, selectedDate]);

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <MinaMap className={styles.headerIcon} />
          <div>
            <h2>{t("title")}</h2>
            <p>{t("description")}</p>
          </div>
        </div>
        <span>{activity.month.label}</span>
      </header>

      <div className={styles.layout}>
        <div className={styles.mapCard}>
          <IncidentsHeatmapMap points={heatmapPoints} />
        </div>

        <ActivityCalendar
          days={activity.calendarDays}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </section>
  );
};

export { IncidentsActivityPanel };
export type { IncidentsActivityPanelProps };
