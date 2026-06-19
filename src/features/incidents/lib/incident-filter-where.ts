import "server-only";

import { IncidentStatus, ParticipantRole } from "@/generated/prisma/enums";
import { getRelativeDayBoundaries } from "./dates";
import type {
  IncidentDateRangeKey,
  IncidentsFiltersValue,
} from "../types/incidents-filters.types";
import type { Prisma } from "@/generated/prisma/client";

type GetIncidentDateRangeStart = {
  dateRange: IncidentDateRangeKey | undefined;
};

type GetIncidentFiltersWhere = {
  filters: IncidentsFiltersValue | undefined;
};

type GetActiveIncidentWhere = {
  projectId: string;
};

type GetProjectIncidentWhere = {
  projectId: string;
  filters?: IncidentsFiltersValue;
  conditions?: Prisma.IncidentWhereInput[];
};

const getIncidentDateRangeStart = ({
  dateRange,
}: GetIncidentDateRangeStart) => {
  const { last30DaysStart, lastYearStart, sevenDaysAgoStart } =
    getRelativeDayBoundaries();

  if (dateRange === "last_7_days") {
    return sevenDaysAgoStart;
  }

  if (dateRange === "last_year") {
    return lastYearStart;
  }

  return last30DaysStart;
};

const getIncidentFiltersWhere = ({
  filters,
}: GetIncidentFiltersWhere): Prisma.IncidentWhereInput => {
  if (!filters) {
    return {};
  }

  return {
    createdAt: {
      gte: getIncidentDateRangeStart({
        dateRange: filters.dateRange,
      }),
    },
    ...(filters.status
      ? {
          status: filters.status,
        }
      : {}),
    ...(filters.priority
      ? {
          priority: filters.priority,
        }
      : {}),
    ...(filters.categoryId
      ? {
          categoryId: filters.categoryId,
        }
      : {}),
    ...(filters.assigneeId
      ? {
          participants: {
            some: {
              role: ParticipantRole.ASSIGNEE,
              userId: filters.assigneeId,
            },
          },
        }
      : {}),
  };
};

const getActiveIncidentWhere = ({
  projectId,
}: GetActiveIncidentWhere): Prisma.IncidentWhereInput => {
  return {
    projectId,
    deletedAt: null,
    status: {
      not: IncidentStatus.CLOSED,
    },
  };
};

const getProjectIncidentWhere = ({
  projectId,
  filters,
  conditions = [],
}: GetProjectIncidentWhere): Prisma.IncidentWhereInput => {
  const filtersWhere = getIncidentFiltersWhere({ filters });
  const andConditions = [filtersWhere, ...conditions].filter(
    (condition) => Object.keys(condition).length > 0,
  );

  return {
    projectId,
    deletedAt: null,
    ...(andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {}),
  };
};

export {
  getActiveIncidentWhere,
  getIncidentDateRangeStart,
  getIncidentFiltersWhere,
  getProjectIncidentWhere,
};
