import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";
import type { MapIncident } from "../queries/get-active-project-map";

type MapIncidentFilters = {
  status: IncidentStatus | null;
  priority: IncidentPriority | null;
};

const filterIncidents = (incidents: MapIncident[], filters: MapIncidentFilters) => {
  return incidents.filter((incident) => {
    const matchesStatus = filters.status ? incident.status === filters.status : true;
    const matchesPriority = filters.priority ? incident.priority === filters.priority : true;

    return matchesStatus && matchesPriority;
  });
};

export { filterIncidents };
export type { MapIncidentFilters };
