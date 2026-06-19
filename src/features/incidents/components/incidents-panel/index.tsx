"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { IncidentsFilters } from "../incidents-filters";
import type { IncidentsFiltersValue } from "../incidents-filters";
import { IncidentsOverview } from "../incidents-overview";
import { RiskIndicators } from "../risk-indicators";
import type {
  IncidentsOverview as IncidentsOverviewData,
  RiskIndicatorKey,
} from "../../queries/get-incidents-overview";
import styles from "./incidents-panel.module.scss";

interface IncidentsPanelProps {
  data: IncidentsOverviewData;
}

const IncidentsPanel = ({ data }: IncidentsPanelProps) => {
  const t = useTranslations("incidents.dashboard");
  const [filters, setFilters] = useState<IncidentsFiltersValue>({
    dateRange: data.filters.defaultDateRange,
    status: null,
    priority: null,
    categoryId: null,
    assigneeId: null,
  });
  const [selectedRiskIndicator, setSelectedRiskIndicator] =
    useState<RiskIndicatorKey | null>(null);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span>
            <h1>{t("title")}</h1>
            <p className={styles.eyebrow}>{data.project.name}</p>
          </span>
          <p>{t("description")}</p>
        </div>

        {data.access.canCreateIncidents && (
          <Button asChild>
            <Link href="/map">{t("create_action")}</Link>
          </Button>
        )}
      </header>

      <section className={styles.toolbar}>
        <IncidentsFilters
          value={filters}
          options={data.filters.options}
          onChange={setFilters}
        />
      </section>

      <IncidentsOverview metrics={data.metrics} />

      <RiskIndicators
        indicators={data.riskIndicators}
        selectedIndicator={selectedRiskIndicator}
        onIndicatorChange={setSelectedRiskIndicator}
      />
    </main>
  );
};

export { IncidentsPanel };
export type { IncidentsPanelProps };
