"use client";

import { useTranslations } from "next-intl";
import { MinaUsers } from "@zcorvus/icons-react";
import type {
  IncidentReporterPerformance,
  IncidentResolverPerformance,
  IncidentsTeamPerformance,
  IncidentWorkloadPerformance,
} from "../../queries/get-incidents-team-performance";
import { PerformanceCard } from "./components/performance-card";
import type { PerformanceCardItem } from "./components/performance-card";
import styles from "./incidents-team-performance-panel.module.scss";

interface IncidentsTeamPerformancePanelProps {
  performance: IncidentsTeamPerformance;
}

const mapResolvers = (
  items: IncidentResolverPerformance[],
  getAverageLabel: (days: number) => string,
): PerformanceCardItem[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    value: item.closedCount,
    meta: getAverageLabel(item.averageResolutionDays),
  }));

const mapReporters = (
  items: IncidentReporterPerformance[],
): PerformanceCardItem[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    value: item.reportedCount,
  }));

const mapWorkloads = (
  items: IncidentWorkloadPerformance[],
  getHighPriorityLabel: (count: number) => string,
): PerformanceCardItem[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    value: item.openCount,
    secondaryValue: item.overdueCount,
    secondaryTone: item.overdueCount > 0 ? "danger" : "warning",
    meta: getHighPriorityLabel(item.highPriorityCount),
  }));

const IncidentsTeamPerformancePanel = ({
  performance,
}: IncidentsTeamPerformancePanelProps) => {
  const t = useTranslations("incidents.team");

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <MinaUsers className={styles.headerIcon} />
        <div className={styles.headerContent}>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </div>
      </header>

      <div className={styles.grid}>
        <PerformanceCard
          title={t("resolvers.title")}
          description={t("resolvers.description")}
          emptyMessage={t("empty")}
          tone="chart-3"
          items={mapResolvers(
            performance.resolvers,
            (days) => t("resolvers.average_resolution", { days }),
          )}
          valueLabel={(item) => String(item.value)}
        />

        <PerformanceCard
          title={t("reporters.title")}
          description={t("reporters.description")}
          emptyMessage={t("empty")}
          tone="chart-4"
          items={mapReporters(performance.reporters)}
          valueLabel={(item) => String(item.value)}
        />

        <PerformanceCard
          title={t("workload.title")}
          description={t("workload.description")}
          emptyMessage={t("empty")}
          tone="chart-5"
          items={mapWorkloads(
            performance.workloads,
            (count) => t("workload.high_priority", { count }),
          )}
          valueLabel={(item) => String(item.value)}
        />
      </div>
    </section>
  );
};

export { IncidentsTeamPerformancePanel };
export type { IncidentsTeamPerformancePanelProps };
