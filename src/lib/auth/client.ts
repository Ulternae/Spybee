"use client";

import { createAuthClient } from "better-auth/react";
import {
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { ac, organizationRoles } from "./permissions";

const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: organizationRoles,
    }),
    twoFactorClient(),
  ],
});

export { authClient };
