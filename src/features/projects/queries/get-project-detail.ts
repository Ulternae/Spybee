import "server-only";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/auth";
import { getProjectAccess } from "@/lib/auth/access/get-project-access";
import { prisma } from "@/lib/db/prisma";
import type { ProjectRole } from "@/generated/prisma/enums";

type ProjectDetailUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type ProjectDetailMember = {
  id: string;
  role: ProjectRole;
  createdAt: Date;
  user: ProjectDetailUser;
};

type ProjectDetail = {
  project: {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    incidentsCount: number;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  members: ProjectDetailMember[];
  availableUsers: ProjectDetailUser[];
  access: {
    canManageProjectMembers: boolean;
  };
};

const getProjectDetail = async ({ projectId, locale }: { projectId: string; locale: string; }): Promise<ProjectDetail> => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect({ href: "/login", locale });
    throw new Error("Unauthenticated");
  }

  const { canReadProject, canManageProjectMembers } = await getProjectAccess(projectId);

  if (!canReadProject) {
    redirect({ href: "/projects", locale });
    throw new Error("User cannot read project");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      organizationId: true,
      name: true,
      slug: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
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
      },
      members: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          role: true,
          createdAt: true,
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
      _count: {
        select: {
          incidents: true,
        },
      },
    },
  });

  if (!project) {
    redirect({ href: "/projects", locale });
    throw new Error("Project not found");
  }

  const projectMemberUserIds = new Set(
    project.members.map((member) => member.user.id),
  );
  const availableUsers = project.organization.members
    .map((member) => member.user)
    .filter((user) => !projectMemberUserIds.has(user.id));

  return {
    project: {
      id: project.id,
      organizationId: project.organizationId,
      name: project.name,
      slug: project.slug,
      incidentsCount: project._count.incidents,
    },
    organization: {
      id: project.organization.id,
      name: project.organization.name,
      slug: project.organization.slug,
    },
    members: project.members,
    availableUsers,
    access: {
      canManageProjectMembers: canManageProjectMembers,
    },
  };
};

export { getProjectDetail };
export type { ProjectDetail, ProjectDetailMember, ProjectDetailUser };
