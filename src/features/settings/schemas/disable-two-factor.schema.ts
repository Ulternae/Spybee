import z from "zod";

const disableTwoFactorSchema = z.object({
  password: z.string().min(8),
});

type DisableTwoFactorInput = z.infer<typeof disableTwoFactorSchema>;

export { disableTwoFactorSchema };
export type { DisableTwoFactorInput };
