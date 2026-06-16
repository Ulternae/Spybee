import z from "zod";

const verifyEnableTwoFactorSchema = z.object({
  code: z.string().length(6),
});

type VerifyEnableTwoFactorInput = z.infer<
  typeof verifyEnableTwoFactorSchema
>;

export { verifyEnableTwoFactorSchema };
export type { VerifyEnableTwoFactorInput };
