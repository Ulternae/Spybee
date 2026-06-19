import "server-only";

import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import {
  IncidentPriority,
  IncidentStatus,
  ParticipantRole,
} from "@/generated/prisma/enums";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import { getRelativeDayBoundaries } from "../lib/dates";
import type {
  IncidentDateRangeKey,
  IncidentsFiltersValue,
  RiskIndicatorKey,
} from "../types/incidents-filters.types";
import type {
  IncidentPriority as IncidentPriorityType,
  IncidentStatus as IncidentStatusType,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

type IncidentTableUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type IncidentTableItem = {
  id: string;
  sequenceNo: number;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  priority: IncidentPriorityType;
  status: IncidentStatusType;
  latitude: number;
  longitude: number;
  locationDescription: string | null;
  dueDate: string | null;
  createdAt: string;
  createdBy: IncidentTableUser | null;
  assignees: IncidentTableUser[];
  assigneeIds: string[];
  observerIds: string[];
  tagIds: string[];
};

type IncidentsTableData = {
  items: IncidentTableItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  access: {
    canUpdateIncidents: boolean;
  };
};

type GetIncidentsTableInput = {
  page?: number;
  pageSize?: number;
  filters?: IncidentsFiltersValue;
  riskIndicator?: RiskIndicatorKey | null;
};

type IncidentParticipant = {
  role: ParticipantRole;
  user: IncidentTableUser;
};

type GetParticipantsByRoleInput = {
  participants: IncidentParticipant[];
  role: ParticipantRole;
};

type GetRiskIndicator = {
  riskIndicator: RiskIndicatorKey | null | undefined;
};

type GetFiltersWhere = {
  filters: IncidentsFiltersValue | undefined;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const normalizePage = (page?: number) => {
  if (!page || Number.isNaN(page) || page < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return Math.floor(page);
};

const getParticipantsByRole = ({
  participants,
  role,
}: GetParticipantsByRoleInput) => {
  return participants.filter((participant) => participant.role === role);
};

const getDateRangeStart = (dateRange: IncidentDateRangeKey | undefined) => {
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

const getFiltersWhere = ({
  filters,
}: GetFiltersWhere): Prisma.IncidentWhereInput => {
  if (!filters) {
    return {};
  }

  const dateRangeStart = getDateRangeStart(filters.dateRange);

  return {
    createdAt: {
      gte: dateRangeStart,
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

const getRiskIndicatorWhere = ({
  riskIndicator,
}: GetRiskIndicator): Prisma.IncidentWhereInput => {
  if (!riskIndicator) {
    return {};
  }

  const { todayStart, sevenDaysAgoStart, next7DaysEnd } =
    getRelativeDayBoundaries();
  const activeIncidentWhere = {
    status: {
      not: IncidentStatus.CLOSED,
    },
  } satisfies Prisma.IncidentWhereInput;

  if (riskIndicator === "overdue_today") {
    return {
      ...activeIncidentWhere,
      dueDate: {
        lte: todayStart,
      },
    };
  }

  if (riskIndicator === "stale_7_days") {
    return {
      ...activeIncidentWhere,
      updatedAt: {
        lte: sevenDaysAgoStart,
      },
    };
  }

  if (riskIndicator === "high_priority_open") {
    return {
      priority: IncidentPriority.HIGH,
      status: IncidentStatus.OPEN,
    };
  }

  return {
    ...activeIncidentWhere,
    dueDate: {
      gte: todayStart,
      lte: next7DaysEnd,
    },
  };
};

const getIncidentsTable = async ({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  filters,
  riskIndicator,
}: GetIncidentsTableInput = {}): Promise<IncidentsTableData> => {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const activeProjectId = cookieStore.get(COOKIE_KEYS.ACTIVE_PROJECT_ID)?.value;

  if (!activeProjectId) {
    redirect({ href: "/projects", locale });
    throw new Error("No active project");
  }

  const access = await getProjectAccess(activeProjectId);

  if (!access.canReadProject) {
    redirect({ href: "/projects", locale });
    throw new Error("User cannot read active project");
  }

  const normalizedPage = normalizePage(page);
  const normalizedPageSize = Math.max(1, Math.floor(pageSize));
  const conditions = [
    getFiltersWhere({ filters }),
    getRiskIndicatorWhere({ riskIndicator }),
  ].filter((condition) => Object.keys(condition).length > 0);
  const where = {
    projectId: activeProjectId,
    deletedAt: null,
    ...(conditions.length > 0
      ? {
          AND: conditions,
        }
      : {}),
  } satisfies Prisma.IncidentWhereInput;

  const totalItems = await prisma.incident.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize));
  const currentPage = Math.min(normalizedPage, totalPages);
  const skip = (currentPage - 1) * normalizedPageSize;

  const incidents = await prisma.incident.findMany({
    where,
    skip,
    take: normalizedPageSize,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        sequenceNo: "desc",
      },
    ],
    select: {
      id: true,
      sequenceNo: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      latitude: true,
      longitude: true,
      locationDescription: true,
      dueDate: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          nameEs: true,
          nameEn: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      participants: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      tags: {
        select: {
          tagId: true,
        },
      },
    },
  });

  return {
    items: incidents.map((incident) => {
      const assigneeParticipants = getParticipantsByRole({
        participants: incident.participants,
        role: ParticipantRole.ASSIGNEE,
      });

      const observerParticipants = getParticipantsByRole({
        participants: incident.participants,
        role: ParticipantRole.OBSERVER,
      });

      return {
        id: incident.id,
        sequenceNo: incident.sequenceNo,
        title: incident.title,
        description: incident.description,
        priority: incident.priority,
        status: incident.status,
        latitude: incident.latitude,
        longitude: incident.longitude,
        locationDescription: incident.locationDescription,
        dueDate: incident.dueDate?.toISOString() ?? null,
        createdAt: incident.createdAt.toISOString(),
        category: {
          id: incident.category.id,
          name:
            locale === "es" ? incident.category.nameEs : incident.category.nameEn,
        },
        createdBy: incident.createdBy,
        assignees: assigneeParticipants.map((participant) => participant.user),
        assigneeIds: assigneeParticipants.map(
          (participant) => participant.user.id,
        ),
        observerIds: observerParticipants.map(
          (participant) => participant.user.id,
        ),
        tagIds: incident.tags.map((tag) => tag.tagId),
      };
    }),
    pagination: {
      page: currentPage,
      pageSize: normalizedPageSize,
      totalItems,
      totalPages,
    },
    access: {
      canUpdateIncidents: access.canUpdateIncidents,
    },
  };
};

export { getIncidentsTable };
export type { IncidentTableItem, IncidentTableUser, IncidentsTableData };
