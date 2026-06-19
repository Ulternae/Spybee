import { DEFAULT_INCIDENTS_FILTERS_VALUE } from "@/features/incidents/types/incidents-filters.types";
import type { IncidentsDashboardState } from "./incidents-dashboard.types";

const initialIncidentsDashboardState: IncidentsDashboardState = {
  incidentsDashboardFilters: DEFAULT_INCIDENTS_FILTERS_VALUE,
  incidentsDashboardRiskIndicator: null,
};

export { initialIncidentsDashboardState };
