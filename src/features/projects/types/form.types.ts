import type { FormActionState } from "@/lib/forms/form-action-state";
import type { CreateProjectInput } from "../schemas/create-project.schema";

type CreateProjectResult = {
  projectId: string;
};

type CreateProjectState = FormActionState<CreateProjectInput, CreateProjectResult>;

export type { CreateProjectResult, CreateProjectState };
