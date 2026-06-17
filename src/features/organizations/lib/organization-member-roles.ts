import type { OrganizationRole } from "@/lib/auth/permissions";

const ORGANIZATION_MEMBER_ROLES = ["owner", "admin", "member"] satisfies readonly OrganizationRole[];

type OrganizationMemberRole = (typeof ORGANIZATION_MEMBER_ROLES)[number];

const isOrganizationMemberRole = (role: string): role is OrganizationMemberRole => {
  return ORGANIZATION_MEMBER_ROLES.includes(role as OrganizationMemberRole);
};

export { ORGANIZATION_MEMBER_ROLES, isOrganizationMemberRole };
export type { OrganizationMemberRole };
