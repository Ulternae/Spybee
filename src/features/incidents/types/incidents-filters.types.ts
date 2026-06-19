import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";

type IncidentDateRangeKey = "last_7_days" | "last_30_days" | "last_year";
type RiskIndicatorKey =
  | "overdue_today"
  | "stale_7_days"
  | "high_priority_open"
  | "due_soon_7_days";

type IncidentsFiltersValue = {
  dateRange: IncidentDateRangeKey;
  status: IncidentStatus | null;
  priority: IncidentPriority | null;
  categoryId: string | null;
  assigneeId: string | null;
};

const DEFAULT_INCIDENTS_FILTERS_VALUE = {
  dateRange: "last_year",
  status: null,
  priority: null,
  categoryId: null,
  assigneeId: null,
} satisfies IncidentsFiltersValue;

export { DEFAULT_INCIDENTS_FILTERS_VALUE };
export type { IncidentDateRangeKey, IncidentsFiltersValue, RiskIndicatorKey };
