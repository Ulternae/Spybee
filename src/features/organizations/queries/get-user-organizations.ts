import "server-only";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

type UserOrganization = {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: Date;
  projectsCount: number;
  membersCount: number;
};

const getUserOrganizations = async (locale: string): Promise<UserOrganization[]> => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect({ href: "/login", locale });
    throw new Error("Unauthenticated");
  }

  const memberships = await prisma.member.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      },
    },
  });

  return memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role,
    createdAt: membership.organization.createdAt,
    membersCount: membership.organization._count.members,
    projectsCount: membership.organization._count.projects,
  }));

};

export { getUserOrganizations };
export type { UserOrganization };
