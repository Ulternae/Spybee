import { IncidentsPanel } from "@/features/incidents/components/incidents-panel";
import { getIncidentsActivity } from "@/features/incidents/queries/get-incidents-activity";
import { getIncidentsOverview } from "@/features/incidents/queries/get-incidents-overview";
import { getIncidentsTable } from "@/features/incidents/queries/get-incidents-table";
import { getIncidentsTeamPerformance } from "@/features/incidents/queries/get-incidents-team-performance";

const IncidentsPage = async () => {
  const [overview, activity, incidents, teamPerformance] = await Promise.all([
    getIncidentsOverview(),
    getIncidentsActivity(),
    getIncidentsTable(),
    getIncidentsTeamPerformance(),
  ]);

  return (
    <IncidentsPanel
      activity={activity}
      data={overview}
      incidents={incidents}
      teamPerformance={teamPerformance}
    />
  );
};

export default IncidentsPage;
