import z from "zod";

export const verifyTwoFactorSchema = z.object({
  totpCode: z.string().length(6).optional().or(z.literal("")),
  backupCode: z.string().min(11).optional().or(z.literal("")),
}).refine(({ totpCode, backupCode }) => Boolean(totpCode || backupCode), {
  path: ["totpCode"],
})

export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>
