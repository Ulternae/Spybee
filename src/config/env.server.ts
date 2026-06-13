import { z } from "zod";

const nonEmpty = z.string().min(1);

const serverEnvSchema = z.object({

  // Login social providers
  GOOGLE_CLIENT_ID: nonEmpty,
  GOOGLE_CLIENT_SECRET: nonEmpty,

  // Config general
  HOST: nonEmpty,
});

export const serverEnv = serverEnvSchema.parse(process.env); 