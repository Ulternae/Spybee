"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { useAppStoreApi } from "@/store/app/app.provider";
import { DEFAULT_INCIDENTS_FILTERS_VALUE } from "../../types/incidents-filters.types";
import { IncidentsActivityPanel } from "../incidents-activity-panel";
import { IncidentsFilters } from "../incidents-filters";
import { IncidentsOverview } from "../incidents-overview";
import { IncidentsTable } from "../incidents-table";
import { IncidentsTeamPerformancePanel } from "../incidents-team-performance-panel";
import type { IncidentsActivity } from "../../queries/get-incidents-activity";
import type { IncidentsTableData } from "../../queries/get-incidents-table";
import type { IncidentsOverview as IncidentsOverviewData } from "../../queries/get-incidents-overview";
import type { IncidentsTeamPerformance } from "../../queries/get-incidents-team-performance";
import styles from "./incidents-panel.module.scss";

interface IncidentsPanelProps {
  activity: IncidentsActivity;
  data: IncidentsOverviewData;
  incidents: IncidentsTableData;
  teamPerformance: IncidentsTeamPerformance;
}

const IncidentsPanel = ({ activity, data, incidents, teamPerformance }: IncidentsPanelProps) => {
  const t = useTranslations("incidents.dashboard");
  const appStore = useAppStoreApi();

  useEffect(() => {
    const state = appStore.getState();
    const nextFilters = {
      ...DEFAULT_INCIDENTS_FILTERS_VALUE,
      dateRange: data.filters.defaultDateRange,
    };
    const currentFilters = state.incidentsDashboardFilters;
    const shouldReset =
      state.incidentsDashboardRiskIndicator !== null ||
      currentFilters.dateRange !== nextFilters.dateRange ||
      currentFilters.status !== nextFilters.status ||
      currentFilters.priority !== nextFilters.priority ||
      currentFilters.categoryId !== nextFilters.categoryId ||
      currentFilters.assigneeId !== nextFilters.assigneeId;

    if (shouldReset) {
      state.resetIncidentsDashboard({
        filters: nextFilters,
      });
    }
  }, [appStore, data.filters.defaultDateRange]);

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
        <IncidentsFilters options={data.filters.options} />
      </section>

      <IncidentsOverview metrics={data.metrics} />

      <Tabs defaultValue="activity" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
          <TabsTrigger value="incidents">{t("tabs.incidents")}</TabsTrigger>
          <TabsTrigger value="team">{t("tabs.team")}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <IncidentsActivityPanel activity={activity} />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTable
            data={incidents}
            options={data.filters.options}
            riskIndicators={data.riskIndicators}
          />
        </TabsContent>

        <TabsContent value="team">
          <IncidentsTeamPerformancePanel performance={teamPerformance} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export { IncidentsPanel };
export type { IncidentsPanelProps };
