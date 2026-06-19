import "server-only";

import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import { getIncidentFormOptions } from "./get-incident-form-options";
import { getRelativeDayBoundaries } from "../lib/dates";
import type { IncidentFormOptions } from "./get-incident-form-options";
import type {
  IncidentDateRangeKey,
  RiskIndicatorKey,
} from "../types/incidents-filters.types";
import type { Prisma } from "@/generated/prisma/client";

type IncidentsOverviewMetric = {
  key: "open" | "created" | "closed" | "closure_rate" | "overdue";
  value: string;
  tone: "success" | "info" | "warning" | "danger";
};

type IncidentsRiskIndicator = {
  key: RiskIndicatorKey;
  count: number;
  tone: "neutral" | "warning" | "danger";
};

type IncidentsOverview = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  access: {
    canCreateIncidents: boolean;
    canUpdateIncidents: boolean;
  };
  filters: {
    defaultDateRange: IncidentDateRangeKey;
    options: IncidentFormOptions;
  };
  period: {
    from: string;
    to: string;
  };
  metrics: IncidentsOverviewMetric[];
  riskIndicators: IncidentsRiskIndicator[];
};

const getClosureRate = (closedCount: number, createdCount: number) => {
  if (createdCount === 0) {
    return "0%";
  }

  return `${Math.round((closedCount / createdCount) * 100)}%`;
};

const getIncidentsOverview = async (): Promise<IncidentsOverview> => {
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

  const { now, todayStart, sevenDaysAgoStart, last30DaysStart, next7DaysEnd, } = getRelativeDayBoundaries();
  const periodStart = last30DaysStart;

  const project = await prisma.project.findUnique({
    where: {
      id: activeProjectId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!project) {
    redirect({ href: "/projects", locale });
    throw new Error("Active project not found");
  }

  const activeIncidentWhere = {
    projectId: activeProjectId,
    deletedAt: null,
    status: {
      not: IncidentStatus.CLOSED,
    },
  } satisfies Prisma.IncidentWhereInput;

  const [
    openCount,
    createdCount,
    closedCount,
    overdueActiveCount,
    overdueTodayCount,
    staleCount,
    highPriorityOpenCount,
    dueSoonCount,
    formOptions,
  ] = await Promise.all([
    prisma.incident.count({
      where: {
        projectId: activeProjectId,
        deletedAt: null,
        status: IncidentStatus.OPEN,
      },
    }),
    prisma.incident.count({
      where: {
        projectId: activeProjectId,
        deletedAt: null,
        createdAt: {
          gte: periodStart,
          lte: now,
        },
      },
    }),
    prisma.incident.count({
      where: {
        projectId: activeProjectId,
        deletedAt: null,
        closedAt: {
          gte: periodStart,
          lte: now,
        },
      },
    }),
    prisma.incident.count({
      where: {
        ...activeIncidentWhere,
        dueDate: {
          lt: todayStart,
        },
      },
    }),
    prisma.incident.count({
      where: {
        ...activeIncidentWhere,
        dueDate: {
          lte: todayStart,
        },
      },
    }),
    prisma.incident.count({
      where: {
        ...activeIncidentWhere,
        updatedAt: {
          lte: sevenDaysAgoStart,
        },
      },
    }),
    prisma.incident.count({
      where: {
        projectId: activeProjectId,
        deletedAt: null,
        status: IncidentStatus.OPEN,
        priority: IncidentPriority.HIGH,
      },
    }),
    prisma.incident.count({
      where: {
        ...activeIncidentWhere,
        dueDate: {
          gte: todayStart,
          lte: next7DaysEnd,
        },
      },
    }),
    getIncidentFormOptions({ projectId: activeProjectId }),
  ]);

  return {
    project,
    access: {
      canCreateIncidents: access.canCreateIncidents,
      canUpdateIncidents: access.canUpdateIncidents,
    },
    filters: {
      defaultDateRange: "last_30_days",
      options: formOptions,
    },
    period: {
      from: periodStart.toISOString(),
      to: now.toISOString(),
    },
    metrics: [
      {
        key: "open",
        value: String(openCount),
        tone: "success",
      },
      {
        key: "created",
        value: String(createdCount),
        tone: "info",
      },
      {
        key: "closed",
        value: String(closedCount),
        tone: "danger",
      },
      {
        key: "closure_rate",
        value: getClosureRate(closedCount, createdCount),
        tone: "warning",
      },
      {
        key: "overdue",
        value: String(overdueActiveCount),
        tone: "danger",
      },
    ],
    riskIndicators: [
      {
        key: "overdue_today",
        count: overdueTodayCount,
        tone: overdueTodayCount > 0 ? "danger" : "neutral",
      },
      {
        key: "stale_7_days",
        count: staleCount,
        tone: staleCount > 0 ? "warning" : "neutral",
      },
      {
        key: "high_priority_open",
        count: highPriorityOpenCount,
        tone: highPriorityOpenCount > 0 ? "danger" : "neutral",
      },
      {
        key: "due_soon_7_days",
        count: dueSoonCount,
        tone: dueSoonCount > 0 ? "warning" : "neutral",
      },
    ],
  };
};

export { getIncidentsOverview };
export type {
  IncidentDateRangeKey,
  IncidentsOverview,
  IncidentsOverviewMetric,
  IncidentsRiskIndicator,
  RiskIndicatorKey,
};
