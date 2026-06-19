import { IncidentsPanel } from "@/features/incidents/components/incidents-panel";
import { getIncidentsActivity } from "@/features/incidents/queries/get-incidents-activity";
import { getIncidentsOverview } from "@/features/incidents/queries/get-incidents-overview";

const IncidentsPage = async () => {
  const [overview, activity] = await Promise.all([
    getIncidentsOverview(),
    getIncidentsActivity(),
  ]);

  return <IncidentsPanel activity={activity} data={overview} />;
};

export default IncidentsPage;
