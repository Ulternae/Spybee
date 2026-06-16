import z from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "PASSWORDS_DO_NOT_MATCH",
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
