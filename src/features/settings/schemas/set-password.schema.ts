import z from "zod";

export const setPasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "PASSWORDS_DO_NOT_MATCH",
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
