import "server-only";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getOrganizationAccess } from "@/lib/auth/access/get-organization-access";

type OrganizationDetailUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type OrganizationDetailMember = {
  id: string;
  role: string;
  createdAt: Date;
  user: OrganizationDetailUser;
};

type OrganizationDetail = {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  members: OrganizationDetailMember[];
  availableUsers: OrganizationDetailUser[];
  access: {
    canManageMembers: boolean;
  };
};

const getOrganizationDetail = async ({ organizationId, locale }: { organizationId: string; locale: string; }): Promise<OrganizationDetail> => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect({ href: "/login", locale });
    throw new Error("Unauthenticated");
  }

  const { canManageMembers } = await getOrganizationAccess()

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
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
    },
  });

  if (!organization) {
    redirect({ href: "/organizations", locale });
    throw new Error("Organization not found");
  }

  const currentMember = organization.members.find(
    (member) => member.user.id === session.user.id,
  );

  if (!currentMember) {
    redirect({ href: "/organizations", locale });
    throw new Error("User is not a member of the organization");
  }

  const memberUserIds = organization.members.map((member) => member.user.id);
  const availableUsers = await prisma.user.findMany({
    where: {
      id: {
        notIn: memberUserIds,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return {
    organization: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
    },
    members: organization.members,
    availableUsers,
    access: {
      canManageMembers,
    },
  };
};

export { getOrganizationDetail };
export type {
  OrganizationDetail,
  OrganizationDetailMember,
  OrganizationDetailUser,
};
