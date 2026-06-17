import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export { createOrganizationSchema };
export type { CreateOrganizationInput };
