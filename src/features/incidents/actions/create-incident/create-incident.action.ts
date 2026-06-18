"use server";

import { createValidationErrorState } from "@/lib/forms/form-action-state";
import { incidentFormSchema } from "../../schemas/incident.schema";
import type { IncidentFormInput } from "../../schemas/incident.schema";
import type { IncidentFormState } from "../../types/form.types";
import { createIncidentServerAction } from "./create-incident.server";

const getValues = (formData: FormData): Partial<IncidentFormInput> => ({
  title: String(formData.get("title") ?? ""),
  description: String(formData.get("description") ?? ""),
  categoryId: String(formData.get("categoryId") ?? ""),
  priority: String(formData.get("priority") ?? "") as IncidentFormInput["priority"],
  tagIds: formData.getAll("tagIds").map(String),
  assigneeIds: formData.getAll("assigneeIds").map(String),
  observerIds: formData.getAll("observerIds").map(String),
  latitude: Number(formData.get("latitude") ?? 0),
  longitude: Number(formData.get("longitude") ?? 0),
  locationDescription: String(formData.get("locationDescription") ?? ""),
  dueDate: new Date(String(formData.get("dueDate") ?? "")),
});

const createIncidentAction = async (_: IncidentFormState, formData: FormData): Promise<IncidentFormState> => {
  const values = getValues(formData);
  const parsed = incidentFormSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  return createIncidentServerAction({
    data: parsed.data,
    values,
  });
};

export { createIncidentAction };
