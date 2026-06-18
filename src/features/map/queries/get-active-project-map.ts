import "server-only";

import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import {
  DEFAULT_INCIDENT_FORM_OPTIONS,
  getIncidentFormOptions,
} from "@/features/incidents/queries/get-incident-form-options";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";
import type { IncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";
import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";

type MapIncident = {
  id: string;
  sequenceNo: number;
  title: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  latitude: number;
  longitude: number;
  locationDescription: string | null;
  createdAt: string;
  category: {
    key: string;
    nameEs: string;
    nameEn: string;
  };
};

type ActiveProjectMap = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  access: {
    canCreateIncidents: boolean;
  };
  incidentFormOptions: IncidentFormOptions;
  incidents: MapIncident[];
};

const getActiveProjectMap = async (): Promise<ActiveProjectMap> => {
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

  const project = await prisma.project.findUnique({
    where: {
      id: activeProjectId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      incidents: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          sequenceNo: true,
          title: true,
          status: true,
          priority: true,
          latitude: true,
          longitude: true,
          locationDescription: true,
          createdAt: true,
          category: {
            select: {
              key: true,
              nameEs: true,
              nameEn: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    redirect({ href: "/projects", locale });
    throw new Error("Active project not found");
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
    },
    access: {
      canCreateIncidents: access.canCreateIncidents,
    },
    incidentFormOptions: access.canCreateIncidents
      ? await getIncidentFormOptions({ projectId: activeProjectId })
      : DEFAULT_INCIDENT_FORM_OPTIONS,
    incidents: project.incidents.map((incident) => ({
      ...incident,
      createdAt: incident.createdAt.toISOString(),
    })),
  };
};

export { getActiveProjectMap };
export type { ActiveProjectMap, MapIncident };
