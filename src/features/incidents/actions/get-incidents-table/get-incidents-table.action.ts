"use server";

import { getIncidentsTable } from "../../queries/get-incidents-table";
import type {
  IncidentsFiltersValue,
  RiskIndicatorKey,
} from "../../types/incidents-filters.types";

type GetIncidentsTableActionInput = {
  page: number;
  filters: IncidentsFiltersValue;
  riskIndicator: RiskIndicatorKey | null;
};

const getIncidentsTableAction = async ({ page, filters, riskIndicator }: GetIncidentsTableActionInput) => {
  return getIncidentsTable({ page, filters, riskIndicator });
};

export { getIncidentsTableAction };
