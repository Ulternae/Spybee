import { DEFAULT_INCIDENTS_FILTERS_VALUE } from "@/features/incidents/types/incidents-filters.types";
import type {
  IncidentsDashboardActions,
  IncidentsDashboardSliceStore,
} from "./incidents-dashboard.types";

const incidentsDashboardActions = (
  set: Parameters<IncidentsDashboardSliceStore>[0],
): IncidentsDashboardActions => ({
  setIncidentsDashboardFilters: ({ filters }) =>
    set(
      (state) => {
        state.incidentsDashboardFilters = filters;
      },
      false,
      "incidentsDashboard/setFilters",
    ),

  setIncidentsDashboardRiskIndicator: ({ riskIndicator }) =>
    set(
      (state) => {
        state.incidentsDashboardRiskIndicator = riskIndicator;
      },
      false,
      "incidentsDashboard/setRiskIndicator",
    ),

  resetIncidentsDashboard: (p) =>
    set(
      (state) => {
        state.incidentsDashboardFilters =
          p?.filters ?? DEFAULT_INCIDENTS_FILTERS_VALUE;
        state.incidentsDashboardRiskIndicator = null;
      },
      false,
      "incidentsDashboard/reset",
    ),
});

export { incidentsDashboardActions };
