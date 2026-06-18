import type { IncidentLocation } from "../components/location-preview";
import type { IncidentFormOptions } from "../queries/get-incident-form-options";

type ActionsForm = {
  onChangeState: (p: boolean) => void;
  onSuccess: () => void;
}

type DataForm = {
  location: IncidentLocation | null;
  options: IncidentFormOptions;
}

type ReadyDataForm = DataForm & {
  location: IncidentLocation;
}

export type { ActionsForm, DataForm, ReadyDataForm }
