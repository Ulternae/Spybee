import "server-only";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_KEYS } from "@/lib/http/cookies";

type IncidentFormCategoryOption = {
  id: string;
  key: string;
  nameEs: string;
  nameEn: string;
};

type IncidentFormTagOption = {
  id: string;
  name: string;
  color: string | null;
};

type IncidentFormUserOption = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type IncidentFormOptions = {
  categories: IncidentFormCategoryOption[];
  tags: IncidentFormTagOption[];
  members: IncidentFormUserOption[];
};

const EMPTY_OPTIONS: IncidentFormOptions = {
  categories: [],
  tags: [],
  members: [],
};

const getIncidentFormOptions = async (): Promise<IncidentFormOptions> => {
  const cookieStore = await cookies();
  const activeProjectId = cookieStore.get(COOKIE_KEYS.ACTIVE_PROJECT_ID)?.value;

  if (!activeProjectId) {
    return EMPTY_OPTIONS;
  }

  const project = await prisma.project.findUnique({
    where: {
      id: activeProjectId,
    },
    select: {
      organizationId: true,
      members: {
        orderBy: {
          createdAt: "asc",
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

  if (!project) {
    return EMPTY_OPTIONS;
  }

  const [categories, tags] = await Promise.all([
    prisma.incidentCategory.findMany({
      orderBy: {
        key: "asc",
      },
      select: {
        id: true,
        key: true,
        nameEs: true,
        nameEn: true,
      },
    }),
    prisma.tag.findMany({
      where: {
        organizationId: project.organizationId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    }),
  ]);

  return {
    categories,
    tags,
    members: project.members.map((member) => member.user),
  };
};

export { getIncidentFormOptions };
export type {
  IncidentFormCategoryOption,
  IncidentFormOptions,
  IncidentFormTagOption,
  IncidentFormUserOption,
};
