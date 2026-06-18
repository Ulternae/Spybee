import type { FormActionState } from "@/lib/forms/form-action-state";
import type { IncidentFormInput } from "../schemas/incident.schema";

type IncidentFormResult = {
  incidentId: string;
};

type IncidentFormState = FormActionState<IncidentFormInput, IncidentFormResult>;

export type { IncidentFormResult, IncidentFormState };
