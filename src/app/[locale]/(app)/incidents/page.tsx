import { IncidentsPanel } from "@/features/incidents/components/incidents-panel";
import { getIncidentsAnalytics } from "@/features/incidents/queries/get-incidents-analytics";
import { getIncidentsActivity } from "@/features/incidents/queries/get-incidents-activity";
import { getIncidentsOverview } from "@/features/incidents/queries/get-incidents-overview";
import { getIncidentsTable } from "@/features/incidents/queries/get-incidents-table";
import { getIncidentsTeamPerformance } from "@/features/incidents/queries/get-incidents-team-performance";
import { DEFAULT_INCIDENTS_FILTERS_VALUE } from "@/features/incidents/types/incidents-filters.types";

const IncidentsPage = async () => {
  const [overview, analytics, activity, incidents, teamPerformance] =
    await Promise.all([
      getIncidentsOverview({ filters: DEFAULT_INCIDENTS_FILTERS_VALUE }),
      getIncidentsAnalytics({ filters: DEFAULT_INCIDENTS_FILTERS_VALUE }),
      getIncidentsActivity({ filters: DEFAULT_INCIDENTS_FILTERS_VALUE }),
      getIncidentsTable({ filters: DEFAULT_INCIDENTS_FILTERS_VALUE }),
      getIncidentsTeamPerformance({ filters: DEFAULT_INCIDENTS_FILTERS_VALUE }),
    ]);

  return (
    <IncidentsPanel
      analytics={analytics}
      activity={activity}
      data={overview}
      incidents={incidents}
      teamPerformance={teamPerformance}
    />
  );
};

export default IncidentsPage;
