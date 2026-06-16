import z from "zod";

export const enableTwoFactorSchema = z.object({
  password: z.string().min(8),
})

export type EnableTwoFactorInput = z.infer<typeof enableTwoFactorSchema>
