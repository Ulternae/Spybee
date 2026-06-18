import { getIncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";
import { MapPanel } from "@/features/map/components/map-panel";
import { getActiveProjectMap } from "@/features/map/queries/get-active-project-map";
import type { IncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";

interface MapPageProps {
  params: Promise<{ locale: string }>;
}

const DEFAULT_INCIDENTS_FORM_OPTIONS = {
  categories: [],
  tags: [],
  members: [],
};
const MapPage = async ({ params }: MapPageProps) => {

  const { locale } = await params;
  const data = await getActiveProjectMap(locale);
  const incidentFormOptions: IncidentFormOptions = data.access.canCreateIncidents ? await getIncidentFormOptions() : DEFAULT_INCIDENTS_FORM_OPTIONS;

  return (
    <MapPanel
      data={data}
      incidentFormOptions={incidentFormOptions}
      locale={locale}
    />
  );
};

export default MapPage;
