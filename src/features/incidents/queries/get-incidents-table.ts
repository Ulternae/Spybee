import "server-only";

import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ParticipantRole } from "@/generated/prisma/enums";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";

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
  category: {
    id: string;
    name: string;
  };
  priority: IncidentPriority;
  status: IncidentStatus;
  dueDate: string | null;
  createdAt: string;
  createdBy: IncidentTableUser | null;
  assignees: IncidentTableUser[];
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
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const normalizePage = (page?: number) => {
  if (!page || Number.isNaN(page) || page < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return Math.floor(page);
};

const getIncidentsTable = async ({ page, pageSize = DEFAULT_PAGE_SIZE }: GetIncidentsTableInput = {}): Promise<IncidentsTableData> => {
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
  const where = {
    projectId: activeProjectId,
    deletedAt: null,
  };

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
      priority: true,
      status: true,
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
        where: {
          role: ParticipantRole.ASSIGNEE,
        },
        select: {
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
    },
  });

  return {
    items: incidents.map((incident) => ({
      id: incident.id,
      sequenceNo: incident.sequenceNo,
      title: incident.title,
      priority: incident.priority,
      status: incident.status,
      dueDate: incident.dueDate?.toISOString() ?? null,
      createdAt: incident.createdAt.toISOString(),
      category: {
        id: incident.category.id,
        name: locale === "es" ? incident.category.nameEs : incident.category.nameEn,
      },
      createdBy: incident.createdBy,
      assignees: incident.participants.map((participant) => participant.user),
    })),
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
