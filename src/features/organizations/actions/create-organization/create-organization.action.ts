"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { authClient } from "@/lib/auth/client";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { createOrganizationSlug } from "../../lib/create-organization-slug";
import { createOrganizationSchema } from "../../schemas/create-organization.schema";
import type { CreateOrganizationInput } from "../../schemas/create-organization.schema";
import type { CreateOrganizationState } from "../../types/form.types";

const createOrganizationAction = async (_: CreateOrganizationState, formData: FormData): Promise<CreateOrganizationState> => {

  const data = Object.fromEntries(formData);
  const parsed = createOrganizationSchema.safeParse(data);
  const values: Partial<CreateOrganizationInput> = {
    name: String(data.name ?? ""),
  };

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { data: organization, error } = await authClient.organization.create({
      name: parsed.data.name,
      slug: createOrganizationSlug(parsed.data.name),
    });

    if (error || !organization) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    return createSuccessFormState(values, {
      organizationId: organization.id,
    });
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { createOrganizationAction };
