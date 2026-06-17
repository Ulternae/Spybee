import { createValidationErrorState } from "@/lib/forms/form-action-state";
import { createProjectSchema } from "../../schemas/create-project.schema";
import type { CreateProjectInput } from "../../schemas/create-project.schema";
import type { CreateProjectState } from "../../types/form.types";
import { createProjectServerAction } from "./create-project.server";


const createProjectAction = async (_: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {

  const data = Object.fromEntries(formData);
  const parsed = createProjectSchema.safeParse(data);
  const values: Partial<CreateProjectInput> = {
    name: String(data.name ?? ""),
  };

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return await createProjectServerAction({ data: parsed.data, values })
}

export { createProjectAction }