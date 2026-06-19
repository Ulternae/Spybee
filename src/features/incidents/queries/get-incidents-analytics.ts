import "server-only";

import { addDays, eachWeekOfInterval, format, min } from "date-fns";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import {
  getIncidentDateRangeStart,
  getProjectIncidentWhere,
} from "../lib/incident-filter-where";
import type {
  IncidenceCategoryDatum,
  IncidenceTreemapDatum,
  IncidenceTrendDatum,
} from "@/components/ui/analytics-charts/types";
import type { IncidentsFiltersValue } from "../types/incidents-filters.types";

type IncidentsAnalytics = {
  categoryDistribution: IncidenceCategoryDatum[];
  tagDistribution: IncidenceTreemapDatum[];
  trend: IncidenceTrendDatum[];
};

type GetIncidentsAnalyticsInput = {
  filters?: IncidentsFiltersValue;
};

type TagCount = {
  id: string;
  name: string;
  color: string | null;
  parent: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  total: number;
};

const TAG_FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const getTagColor = (color: string | null, index: number) => {
  return color ?? TAG_FALLBACK_COLORS[index % TAG_FALLBACK_COLORS.length];
};

const getTrendBuckets = (periodStart: Date, now: Date) => {
  const starts = eachWeekOfInterval({
    start: periodStart,
    end: now,
  });

  return starts.map((start) => ({
    start,
    end: min([addDays(start, 6), now]),
    label: format(start, "MMM dd"),
  }));
};

const mapTagDistribution = (tagCounts: TagCount[]): IncidenceTreemapDatum[] => {
  const parentMap = new Map<
    string,
    IncidenceTreemapDatum & { children: IncidenceTreemapDatum[] }
  >();
  const roots: IncidenceTreemapDatum[] = [];

  tagCounts.forEach((tag, index) => {
    if (!tag.parent) {
      roots.push({
        name: tag.name,
        value: tag.total,
        color: getTagColor(tag.color, index),
      });
      return;
    }

    const parent =
      parentMap.get(tag.parent.id) ??
      ({
        name: tag.parent.name,
        color: getTagColor(tag.parent.color, index),
        children: [],
      } satisfies IncidenceTreemapDatum & {
        children: IncidenceTreemapDatum[];
      });

    parent.children.push({
      name: tag.name,
      value: tag.total,
      color: getTagColor(tag.color ?? tag.parent.color, index),
    });
    parentMap.set(tag.parent.id, parent);
  });

  return [...roots, ...parentMap.values()];
};

const getIncidentsAnalytics = async ({
  filters,
}: GetIncidentsAnalyticsInput = {}): Promise<IncidentsAnalytics> => {
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

  const now = new Date();
  const periodStart = getIncidentDateRangeStart({
    dateRange: filters?.dateRange ?? "last_year",
  });
  const where = getProjectIncidentWhere({
    projectId: activeProjectId,
    filters,
  });

  const [categoryRows, taggedIncidents, trendIncidents] = await Promise.all([
    prisma.incidentCategory.findMany({
      select: {
        id: true,
        nameEs: true,
        nameEn: true,
        _count: {
          select: {
            incidents: {
              where,
            },
          },
        },
      },
      orderBy: {
        nameEs: "asc",
      },
    }),
    prisma.incident.findMany({
      where,
      select: {
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                parent: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.incident.findMany({
      where,
      select: {
        createdAt: true,
        closedAt: true,
      },
    }),
  ]);

  const tagCountById = new Map<string, TagCount>();

  taggedIncidents.forEach((incident) => {
    incident.tags.forEach(({ tag }) => {
      const current = tagCountById.get(tag.id);

      tagCountById.set(tag.id, {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        parent: tag.parent,
        total: (current?.total ?? 0) + 1,
      });
    });
  });

  const buckets = getTrendBuckets(periodStart, now);

  return {
    categoryDistribution: categoryRows
      .map((category) => ({
        category: locale === "es" ? category.nameEs : category.nameEn,
        total: category._count.incidents,
      }))
      .filter((category) => category.total > 0),
    tagDistribution: mapTagDistribution(
      Array.from(tagCountById.values()).sort(
        (first, second) => second.total - first.total,
      ),
    ),
    trend: buckets.map((bucket) => {
      const created = trendIncidents.filter(
        (incident) =>
          incident.createdAt >= bucket.start && incident.createdAt <= bucket.end,
      ).length;
      const closed = trendIncidents.filter(
        (incident) =>
          incident.closedAt &&
          incident.closedAt >= bucket.start &&
          incident.closedAt <= bucket.end,
      ).length;
      const backlog = trendIncidents.filter(
        (incident) =>
          incident.createdAt <= bucket.end &&
          (!incident.closedAt || incident.closedAt > bucket.end),
      ).length;

      return {
        label: bucket.label,
        backlog,
        created,
        closed,
      };
    }),
  };
};

export { getIncidentsAnalytics };
export type { IncidentsAnalytics };
