import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { ProjectRole } from "@/generated/prisma/enums";
import type { ProjectRole as ProjectRoleType } from "@/generated/prisma/enums";

type ProjectAccess = {
  canReadProject: boolean;
  canUpdateProject: boolean;
  canDeleteProject: boolean;
  canCreateIncidents: boolean;
  canUpdateIncidents: boolean;
  canDeleteIncidents: boolean;
  canManageProjectMembers: boolean;
};

const EMPTY_PROJECT_ACCESS: ProjectAccess = {
  canReadProject: false,
  canUpdateProject: false,
  canDeleteProject: false,
  canCreateIncidents: false,
  canUpdateIncidents: false,
  canDeleteIncidents: false,
  canManageProjectMembers: false,
};

const PROJECT_ROLE_ACCESS = {
  [ProjectRole.PROJECT_ADMIN]: {
    canReadProject: true,
    canUpdateProject: true,
    canDeleteProject: true,
    canCreateIncidents: true,
    canUpdateIncidents: true,
    canDeleteIncidents: true,
    canManageProjectMembers: true,
  },
  [ProjectRole.EDITOR]: {
    canReadProject: true,
    canUpdateProject: false,
    canDeleteProject: false,
    canCreateIncidents: true,
    canUpdateIncidents: true,
    canDeleteIncidents: false,
    canManageProjectMembers: false,
  },
  [ProjectRole.VIEWER]: {
    canReadProject: true,
    canUpdateProject: false,
    canDeleteProject: false,
    canCreateIncidents: false,
    canUpdateIncidents: false,
    canDeleteIncidents: false,
    canManageProjectMembers: false,
  },
} satisfies Record<ProjectRoleType, ProjectAccess>;

const resolveProjectAccess = (role?: ProjectRoleType | null): ProjectAccess => {
  if (!role) {
    return EMPTY_PROJECT_ACCESS;
  }

  return PROJECT_ROLE_ACCESS[role];
};

const getProjectAccess = async (projectId: string): Promise<ProjectAccess> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return EMPTY_PROJECT_ACCESS;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: session.user.id,
      },
    },
    select: {
      role: true,
    },
  });

  return resolveProjectAccess(membership?.role);
};

export {
  EMPTY_PROJECT_ACCESS,
  PROJECT_ROLE_ACCESS,
  getProjectAccess,
  resolveProjectAccess,
};
export type { ProjectAccess };
