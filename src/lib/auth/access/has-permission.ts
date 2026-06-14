import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

type HasPermissionInput = NonNullable<Parameters<typeof auth.api.hasPermission>[0]>;
type OrganizationPermissionMap = HasPermissionInput["body"]["permissions"];

const hasOrganizationPermissions = async (permissions: OrganizationPermissionMap): Promise<boolean> => {
  try {
    const result = await auth.api.hasPermission({
      headers: await headers(),
      body: { permissions },
    });

    return result.success;
  } catch {
    return false;
  }
};

export {
  hasOrganizationPermissions,
  type OrganizationPermissionMap,
};
