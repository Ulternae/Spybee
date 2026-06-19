"use server";

import { getIncidentsTable } from "../../queries/get-incidents-table";
import type { RiskIndicatorKey } from "../../queries/get-incidents-overview";

type GetIncidentsTableActionInput = {
  page: number;
  riskIndicator: RiskIndicatorKey | null;
};

const getIncidentsTableAction = async ({ page, riskIndicator }: GetIncidentsTableActionInput) => {
  return getIncidentsTable({ page, riskIndicator });
};

export { getIncidentsTableAction };
