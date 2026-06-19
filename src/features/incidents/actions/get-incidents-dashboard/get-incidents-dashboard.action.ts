"use server";

import { getIncidentsActivity } from "../../queries/get-incidents-activity";
import { getIncidentsOverview } from "../../queries/get-incidents-overview";
import { getIncidentsTeamPerformance } from "../../queries/get-incidents-team-performance";
import type { IncidentsFiltersValue } from "../../types/incidents-filters.types";

type GetIncidentsDashboardActionInput = {
  filters: IncidentsFiltersValue;
};

const getIncidentsDashboardAction = async ({ filters }: GetIncidentsDashboardActionInput) => {
  const [overview, activity, teamPerformance] = await Promise.all([
    getIncidentsOverview({ filters }),
    getIncidentsActivity({ filters }),
    getIncidentsTeamPerformance({ filters }),
  ]);

  return {
    overview,
    activity,
    teamPerformance,
  };
};

export { getIncidentsDashboardAction };
