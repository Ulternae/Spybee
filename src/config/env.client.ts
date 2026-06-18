import { z } from "zod";

const nonEmpty = z.string().min(1);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["en", "es"]).default("es"),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: nonEmpty.regex(/^pk/, "Expected Mapbox access token (pk-...)")
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
});