import z from "zod";

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>