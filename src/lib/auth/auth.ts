import "server-only";

import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, twoFactor } from "better-auth/plugins";
import { serverEnv } from "@/config/env.server";
import { prisma } from "@/lib/db/prisma";
import { ac, organizationRoles } from "./permissions";
import { authEmailService } from "@/emails/services/auth-email.service";

const auth = betterAuth({
  appName: "Spybee",
  baseURL: serverEnv.HOST,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }, req) => {
      await authEmailService.sendVerifyAccountEmail({ user, url, req });
    },
    expiresIn: 60 * 60 * 24,
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, req) => {
      await authEmailService.sendResetPasswordEmail({ user, url, req });
    },
  },

  rateLimit: {
    storage: "database",
  },
  plugins: [
    organization({
      ac,
      roles: organizationRoles,
    }),
    twoFactor({
      issuer: "Spybee",
    }),
  ],
});

export { auth };
