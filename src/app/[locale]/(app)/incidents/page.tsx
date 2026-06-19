import { IncidentsPanel } from "@/features/incidents/components/incidents-panel";
import { getIncidentsOverview } from "@/features/incidents/queries/get-incidents-overview";

const IncidentsPage = async () => {
  const data = await getIncidentsOverview();

  return <IncidentsPanel data={data} />;
};

export default IncidentsPage;
