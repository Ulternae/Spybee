import { incidentsDashboardActions } from "./incidents-dashboard.actions";
import { initialIncidentsDashboardState } from "./incidents-dashboard.initial";
import type { IncidentsDashboardSliceStore } from "./incidents-dashboard.types";

const createIncidentsDashboardSlice: IncidentsDashboardSliceStore = (set) => ({
  ...initialIncidentsDashboardState,
  ...incidentsDashboardActions(set),
});

export { createIncidentsDashboardSlice };
