import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export { createProjectSchema };
export type { CreateProjectInput };
