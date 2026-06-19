"use server";

import { getIncidentsActivity } from "../../queries/get-incidents-activity";
import { getIncidentsAnalytics } from "../../queries/get-incidents-analytics";
import { getIncidentsOverview } from "../../queries/get-incidents-overview";
import { getIncidentsTeamPerformance } from "../../queries/get-incidents-team-performance";
import type { IncidentsFiltersValue } from "../../types/incidents-filters.types";

type GetIncidentsDashboardActionInput = {
  filters: IncidentsFiltersValue;
};

const getIncidentsDashboardAction = async ({ filters }: GetIncidentsDashboardActionInput) => {
  const [overview, analytics, activity, teamPerformance] = await Promise.all([
    getIncidentsOverview({ filters }),
    getIncidentsAnalytics({ filters }),
    getIncidentsActivity({ filters }),
    getIncidentsTeamPerformance({ filters }),
  ]);

  return {
    overview,
    analytics,
    activity,
    teamPerformance,
  };
};

export { getIncidentsDashboardAction };
