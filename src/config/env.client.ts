import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["en", "es"]).default("es"),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
});