import type { IncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";
import type { IncidentTableItem } from "@/features/incidents/queries/get-incidents-table";
import { IncidentEditAction } from "../incident-edit-action";

interface IncidentActionsCellProps {
  incident: IncidentTableItem;
  canUpdateIncidents: boolean;
  options: IncidentFormOptions;
  onEditSuccess: () => void;
}

const IncidentActionsCell = ({ incident, canUpdateIncidents, options, onEditSuccess }: IncidentActionsCellProps) => {
  if (!canUpdateIncidents) {
    return null;
  }

  return (
    <IncidentEditAction
      incident={incident}
      options={options}
      onSuccess={onEditSuccess}
    />
  );
};

export { IncidentActionsCell };
