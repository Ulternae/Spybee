import "server-only";

import { hasOrganizationPermissions } from "./has-permission";

interface OrganizationAccess {
  canUpdateOrganization: boolean;
  canDeleteOrganization: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  canCreateProjects: boolean;
}

const getOrganizationAccess = async (): Promise<OrganizationAccess> => {
  const [
    canUpdateOrganization,
    canDeleteOrganization,
    canManageMembers,
    canInviteMembers,
    canCreateProjects,
  ] = await Promise.all([
    hasOrganizationPermissions({ organization: ["update"] }),
    hasOrganizationPermissions({ organization: ["delete"] }),
    hasOrganizationPermissions({ member: ["create", "update", "delete"] }),
    hasOrganizationPermissions({ invitation: ["create"] }),
    hasOrganizationPermissions({ project: ["create"] }),
  ]);

  return {
    canUpdateOrganization,
    canDeleteOrganization,
    canManageMembers,
    canInviteMembers,
    canCreateProjects,
  };
};

export { getOrganizationAccess, type OrganizationAccess };
