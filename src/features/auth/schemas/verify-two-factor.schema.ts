import z from "zod";

export const verifyTwoFactorSchema = z.object({
  totpCode: z.string().min(6).optional().or(z.literal("")),
  backupCode: z.string().min(11).optional().or(z.literal("")),
})

export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>
