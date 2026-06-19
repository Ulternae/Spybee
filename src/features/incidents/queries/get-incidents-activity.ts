import "server-only";

import { eachDayOfInterval, format } from "date-fns";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import { getMonthBoundaries } from "../lib/dates";
import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";

type IncidentActivityDay = {
  date: string;
  day: number;
  count: number;
};

type IncidentHeatmapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  createdDate: string;
  status: IncidentStatus;
  priority: IncidentPriority;
};

type IncidentsActivity = {
  month: {
    label: string;
    from: string;
    to: string;
  };
  calendarDays: IncidentActivityDay[];
  heatmapPoints: IncidentHeatmapPoint[];
};

const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

const getIncidentsActivity = async (): Promise<IncidentsActivity> => {
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

  const { monthStart, monthEnd } = getMonthBoundaries();
  const incidents = await prisma.incident.findMany({
    where: {
      projectId: activeProjectId,
      deletedAt: null,
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      status: true,
      priority: true,
    },
  });

  const countByDay = new Map<string, number>();

  incidents.forEach((incident) => {
    const key = getDateKey(incident.createdAt);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  });

  return {
    month: {
      label: new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(monthStart),
      from: monthStart.toISOString(),
      to: monthEnd.toISOString(),
    },
    calendarDays: eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    }).map((date) => {
      const key = getDateKey(date);

      return {
        date: key,
        day: date.getDate(),
        count: countByDay.get(key) ?? 0,
      };
    }),
    heatmapPoints: incidents.map((incident) => ({
      id: incident.id,
      latitude: incident.latitude,
      longitude: incident.longitude,
      createdAt: incident.createdAt.toISOString(),
      createdDate: getDateKey(incident.createdAt),
      status: incident.status,
      priority: incident.priority,
    })),
  };
};

export { getIncidentsActivity };
export type { IncidentActivityDay, IncidentHeatmapPoint, IncidentsActivity };
