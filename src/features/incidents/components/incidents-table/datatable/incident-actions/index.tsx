import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { IncidentTableItem } from "@/features/incidents/queries/get-incidents-table";
import styles from "../../incidents-table.module.scss";
import { MinaDotsVertical } from "@zcorvus/icons-react";

interface IncidentActionsCellProps {
  incident: IncidentTableItem;
  canUpdateIncidents: boolean;
}

const IncidentActionsCell = ({ incident, canUpdateIncidents }: IncidentActionsCellProps) => {
  const t = useTranslations("common.actions");

  if (!canUpdateIncidents) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={styles.actionButton}
      aria-label={t("edit")}
      data-incident-id={incident.id}
    >
      <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
    </Button>
  );
};

export { IncidentActionsCell };
