import { z } from "zod";

const nonEmpty = z.string().min(1);

const serverEnvSchema = z.object({

  DATABASE_URL: nonEmpty,
  BETTER_AUTH_SECRET: nonEmpty.min(32),

  // API keys
  RESEND_API_KEY: nonEmpty.regex(/^re/, "Expected Resend API key (re-...)"),

  // Login social providers
  GOOGLE_CLIENT_ID: nonEmpty,
  GOOGLE_CLIENT_SECRET: nonEmpty,

  // Config general
  HOST: nonEmpty,
  APP_HOST: nonEmpty,
  PROTOCOL: z.enum(["http", "https"]),

  // Email addresses
  EMAIL_FROM_SECURITY: z.email(),
  EMAIL_FROM_AUTH: z.email(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
