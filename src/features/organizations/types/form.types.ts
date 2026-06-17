import type { FormActionState } from "@/lib/forms/form-action-state";
import type { CreateOrganizationInput } from "../schemas/create-organization.schema";

type CreateOrganizationResult = {
  organizationId: string;
};

type CreateOrganizationState = FormActionState<
  CreateOrganizationInput,
  CreateOrganizationResult
>;

export type { CreateOrganizationResult, CreateOrganizationState };
