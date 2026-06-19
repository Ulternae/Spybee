import "server-only";

import { differenceInCalendarDays } from "date-fns";
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
import {
  getIncidentDateRangeStart,
  getProjectIncidentWhere,
} from "../lib/incident-filter-where";
import type { IncidentsFiltersValue } from "../types/incidents-filters.types";

type IncidentPerformanceUser = {
  id: string;
  name: string;
  image: string | null;
};

type IncidentResolverPerformance = IncidentPerformanceUser & {
  closedCount: number;
  averageResolutionDays: number;
};

type IncidentReporterPerformance = IncidentPerformanceUser & {
  reportedCount: number;
};

type IncidentWorkloadPerformance = IncidentPerformanceUser & {
  openCount: number;
  highPriorityCount: number;
  overdueCount: number;
};

type IncidentsTeamPerformance = {
  period: {
    from: string;
    to: string;
  };
  resolvers: IncidentResolverPerformance[];
  reporters: IncidentReporterPerformance[];
  workloads: IncidentWorkloadPerformance[];
};

type GetIncidentsTeamPerformanceInput = {
  filters?: IncidentsFiltersValue;
};

const sortDesc = <T>(items: T[], getValue: (item: T) => number) => {
  return [...items].sort((first, second) => getValue(second) - getValue(first));
};

const getUserMap = (users: IncidentPerformanceUser[]) => {
  return new Map(users.map((user) => [user.id, user]));
};

const getIncidentsTeamPerformance = async ({ filters }: GetIncidentsTeamPerformanceInput = {}): Promise<IncidentsTeamPerformance> => {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const activeProjectId = cookieStore.get(
    COOKIE_KEYS.ACTIVE_PROJECT_ID,
  )?.value;

  if (!activeProjectId) {
    redirect({ href: "/projects", locale });
    throw new Error("No active project");
  }

  const access = await getProjectAccess(activeProjectId);

  if (!access.canReadProject) {
    redirect({ href: "/projects", locale });
    throw new Error("User cannot read active project");
  }

  const { now, todayStart } = getRelativeDayBoundaries();
  const periodStart = getIncidentDateRangeStart({
    dateRange: filters?.dateRange ?? "last_year",
  });

  const [members, closedIncidents, reportedIncidents, activeIncidents] =
    await Promise.all([
      prisma.projectMember.findMany({
        where: {
          projectId: activeProjectId,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.incident.findMany({
        where: getProjectIncidentWhere({
          projectId: activeProjectId,
          filters,
          conditions: [
            {
              closedAt: {
                gte: periodStart,
                lte: now,
              },
            },
          ],
        }),
        select: {
          createdAt: true,
          closedAt: true,
          participants: {
            where: {
              role: ParticipantRole.ASSIGNEE,
            },
            select: {
              userId: true,
            },
          },
        },
      }),
      prisma.incident.findMany({
        where: getProjectIncidentWhere({
          projectId: activeProjectId,
          filters,
          conditions: [
            {
              createdAt: {
                gte: periodStart,
                lte: now,
              },
              createdById: {
                not: null,
              },
            },
          ],
        }),
        select: {
          createdById: true,
        },
      }),
      prisma.incident.findMany({
        where: getProjectIncidentWhere({
          projectId: activeProjectId,
          filters,
          conditions: [
            {
              status: {
                not: IncidentStatus.CLOSED,
              },
            },
          ],
        }),
        select: {
          priority: true,
          dueDate: true,
          participants: {
            where: {
              role: ParticipantRole.ASSIGNEE,
            },
            select: {
              userId: true,
            },
          },
        },
      }),
    ]);

  const users = members.map(({ user }) => user);
  const userById = getUserMap(users);
  const resolverStats = new Map<
    string,
    { closedCount: number; totalResolutionDays: number }
  >();
  const reporterStats = new Map<string, number>();
  const workloadStats = new Map<
    string,
    { openCount: number; highPriorityCount: number; overdueCount: number }
  >();

  users.forEach((user) => {
    resolverStats.set(user.id, {
      closedCount: 0,
      totalResolutionDays: 0,
    });
    reporterStats.set(user.id, 0);
    workloadStats.set(user.id, {
      openCount: 0,
      highPriorityCount: 0,
      overdueCount: 0,
    });
  });

  closedIncidents.forEach((incident) => {
    if (!incident.closedAt) {
      return;
    }

    const resolutionDays = Math.max(
      0,
      differenceInCalendarDays(incident.closedAt, incident.createdAt),
    );

    incident.participants.forEach((participant) => {
      const stat = resolverStats.get(participant.userId);

      if (!stat) {
        return;
      }

      stat.closedCount += 1;
      stat.totalResolutionDays += resolutionDays;
    });
  });

  reportedIncidents.forEach((incident) => {
    if (!incident.createdById) {
      return;
    }

    reporterStats.set(
      incident.createdById,
      (reporterStats.get(incident.createdById) ?? 0) + 1,
    );
  });

  activeIncidents.forEach((incident) => {
    incident.participants.forEach((participant) => {
      const stat = workloadStats.get(participant.userId);

      if (!stat) {
        return;
      }

      stat.openCount += 1;

      if (incident.priority === IncidentPriority.HIGH) {
        stat.highPriorityCount += 1;
      }

      if (incident.dueDate && incident.dueDate < todayStart) {
        stat.overdueCount += 1;
      }
    });
  });

  return {
    period: {
      from: periodStart.toISOString(),
      to: now.toISOString(),
    },
    resolvers: sortDesc(
      Array.from(resolverStats.entries()).flatMap(([userId, stat]) => {
        const user = userById.get(userId);

        if (!user || stat.closedCount === 0) {
          return [];
        }

        return {
          ...user,
          closedCount: stat.closedCount,
          averageResolutionDays:
            stat.closedCount === 0
              ? 0
              : Math.round(stat.totalResolutionDays / stat.closedCount),
        };
      }),
      (item) => item.closedCount,
    ).slice(0, 6),
    reporters: sortDesc(
      Array.from(reporterStats.entries()).flatMap(([userId, count]) => {
        const user = userById.get(userId);

        if (!user || count === 0) {
          return [];
        }

        return {
          ...user,
          reportedCount: count,
        };
      }),
      (item) => item.reportedCount,
    ).slice(0, 6),
    workloads: sortDesc(
      Array.from(workloadStats.entries()).flatMap(([userId, stat]) => {
        const user = userById.get(userId);

        if (!user || stat.openCount === 0) {
          return [];
        }

        return {
          ...user,
          ...stat,
        };
      }),
      (item) => item.openCount,
    ).slice(0, 6),
  };
};

export { getIncidentsTeamPerformance };
export type {
  IncidentReporterPerformance,
  IncidentResolverPerformance,
  IncidentsTeamPerformance,
  IncidentWorkloadPerformance,
};
