"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { useAppStore, useAppStoreApi } from "@/store/app/app.provider";
import { DEFAULT_INCIDENTS_FILTERS_VALUE } from "../../types/incidents-filters.types";
import { getIncidentsDashboardAction } from "../../actions/get-incidents-dashboard/get-incidents-dashboard.action";
import { IncidentsAnalyticsPanel } from "../incidents-analytics-panel";
import { IncidentsActivityPanel } from "../incidents-activity-panel";
import { IncidentsFilters } from "../incidents-filters";
import { IncidentsOverview } from "../incidents-overview";
import { IncidentsTable } from "../incidents-table";
import { IncidentsTeamPerformancePanel } from "../incidents-team-performance-panel";
import type { IncidentsActivity } from "../../queries/get-incidents-activity";
import type { IncidentsAnalytics } from "../../queries/get-incidents-analytics";
import type { IncidentsTableData } from "../../queries/get-incidents-table";
import type { IncidentsOverview as IncidentsOverviewData } from "../../queries/get-incidents-overview";
import type { IncidentsTeamPerformance } from "../../queries/get-incidents-team-performance";
import styles from "./incidents-panel.module.scss";

interface IncidentsPanelProps {
  analytics: IncidentsAnalytics;
  activity: IncidentsActivity;
  data: IncidentsOverviewData;
  incidents: IncidentsTableData;
  teamPerformance: IncidentsTeamPerformance;
}

const IncidentsPanel = ({ analytics, activity, data, incidents, teamPerformance }: IncidentsPanelProps) => {

  const t = useTranslations("incidents.dashboard");
  const appStore = useAppStoreApi();
  const filters = useAppStore((state) => state.incidentsDashboardFilters);
  const [overviewData, setOverviewData] = useState(data);
  const [analyticsData, setAnalyticsData] = useState(analytics);
  const [activityData, setActivityData] = useState(activity);
  const [teamPerformanceData, setTeamPerformanceData] = useState(teamPerformance);
  const [, startTransition] = useTransition();
  const requestIdRef = useRef(0);
  const didMountRef = useRef(false);

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

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void getIncidentsDashboardAction({ filters })
      .then((nextData) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        startTransition(() => {
          setOverviewData(nextData.overview);
          setAnalyticsData(nextData.analytics);
          setActivityData(nextData.activity);
          setTeamPerformanceData(nextData.teamPerformance);
        });
      })
      .catch(() => undefined);
  }, [filters, startTransition]);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span>
            <h1>{t("title")}</h1>
            <p className={styles.eyebrow}>{overviewData.project.name}</p>
          </span>
          <p>{t("description")}</p>
        </div>

        {overviewData.access.canCreateIncidents && (
          <Button asChild>
            <Link href="/map">{t("create_action")}</Link>
          </Button>
        )}
      </header>

      <section className={styles.toolbar}>
        <IncidentsFilters options={overviewData.filters.options} />
      </section>

      <IncidentsOverview metrics={overviewData.metrics} />

      <IncidentsAnalyticsPanel analytics={analyticsData} />

      <Tabs defaultValue="activity" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
          <TabsTrigger value="incidents">{t("tabs.incidents")}</TabsTrigger>
          <TabsTrigger value="team">{t("tabs.team")}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <IncidentsActivityPanel activity={activityData} />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTable
            data={incidents}
            options={overviewData.filters.options}
            riskIndicators={overviewData.riskIndicators}
          />
        </TabsContent>

        <TabsContent value="team">
          <IncidentsTeamPerformancePanel performance={teamPerformanceData} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export { IncidentsPanel };
export type { IncidentsPanelProps };
