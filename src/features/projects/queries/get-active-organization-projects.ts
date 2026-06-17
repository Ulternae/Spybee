import "server-only";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

type ProjectListItem = {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  createdAt: Date;
  incidentsCount: number;
  membersCount: number;
};

type ActiveOrganizationProjects = {
  organization: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
  projects: ProjectListItem[];
};

const getActiveOrganizationProjects = async (locale: string): Promise<ActiveOrganizationProjects> => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect({ href: "/login", locale });
    throw new Error("Unauthenticated");
  }

  const activeOrganizationId = session.session.activeOrganizationId;

  if (!activeOrganizationId) {
    redirect({ href: "/organizations", locale });
    throw new Error("No active organization");
  }

  const membership = await prisma.member.findFirst({
    where: {
      organizationId: activeOrganizationId,
      userId: session.user.id,
    },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          projects: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              name: true,
              slug: true,
              createdAt: true,
              members: {
                where: {
                  userId: session.user.id,
                },
                select: {
                  role: true,
                },
              },
              _count: {
                select: {
                  incidents: true,
                  members: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!membership) {
    redirect({ href: "/organizations", locale });
    throw new Error("User is not a member of the active organization");
  }

  return {
    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
    },
    projects: membership.organization.projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      role: project.members[0]?.role ?? null,
      createdAt: project.createdAt,
      incidentsCount: project._count.incidents,
      membersCount: project._count.members,
    })),
  };
};

export { getActiveOrganizationProjects };
export type { ActiveOrganizationProjects, ProjectListItem };
