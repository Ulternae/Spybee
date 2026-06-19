import { IncidentsPanel } from "@/features/incidents/components/incidents-panel";
import { getIncidentsActivity } from "@/features/incidents/queries/get-incidents-activity";
import { getIncidentsOverview } from "@/features/incidents/queries/get-incidents-overview";
import { getIncidentsTable } from "@/features/incidents/queries/get-incidents-table";

const IncidentsPage = async () => {
  const [overview, activity, incidents] = await Promise.all([
    getIncidentsOverview(),
    getIncidentsActivity(),
    getIncidentsTable(),
  ]);

  return (
    <IncidentsPanel
      activity={activity}
      data={overview}
      incidents={incidents}
    />
  );
};

export default IncidentsPage;
