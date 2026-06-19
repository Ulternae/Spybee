import type { Store } from "@/store/types";
import type {
  IncidentsFiltersValue,
  RiskIndicatorKey,
} from "@/features/incidents/types/incidents-filters.types";
import type { AppStoreState } from "../app.store";

type SetIncidentsDashboardFilters = {
  filters: IncidentsFiltersValue;
};

type SetIncidentsDashboardRiskIndicator = {
  riskIndicator: RiskIndicatorKey | null;
};

type ResetIncidentsDashboard = {
  filters?: IncidentsFiltersValue;
};

export type IncidentsDashboardState = {
  incidentsDashboardFilters: IncidentsFiltersValue;
  incidentsDashboardRiskIndicator: RiskIndicatorKey | null;
};

export type IncidentsDashboardActions = {
  setIncidentsDashboardFilters: (p: SetIncidentsDashboardFilters) => void;
  setIncidentsDashboardRiskIndicator: (p: SetIncidentsDashboardRiskIndicator) => void;
  resetIncidentsDashboard: (p?: ResetIncidentsDashboard) => void;
};

export type IncidentsDashboardSlice = IncidentsDashboardState & IncidentsDashboardActions;
export type IncidentsDashboardSliceStore = Store<AppStoreState, IncidentsDashboardSlice>;
