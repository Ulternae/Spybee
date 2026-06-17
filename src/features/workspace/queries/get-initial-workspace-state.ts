import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { AppStoreState } from "@/store/app/app.store";

const getInitialWorkspaceState = async (): Promise<Partial<AppStoreState>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const activeOrganizationId = session?.session.activeOrganizationId;

  if (!session?.user) {
    return {
      isAuthenticated: false,
      hasHydrated: true,
    };
  }

  if (!activeOrganizationId) {
    return {
      isAuthenticated: true,
      hasHydrated: true,
    };
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
              organizationId: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return {
      isAuthenticated: true,
      hasHydrated: true,
    };
  }

  return {
    isAuthenticated: true,
    activeOrganization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
    },
    projects: membership.organization.projects,
    hasHydrated: true,
  };
};

export { getInitialWorkspaceState };
