import type { IncidentTableItem } from "@/features/incidents/queries/get-incidents-table";
import styles from "../../incidents-table.module.scss";

interface IncidentTitleCellProps {
  incident: IncidentTableItem;
}

const IncidentTitleCell = ({ incident }: IncidentTitleCellProps) => {
  return (
    <div className={styles.titleCell}>
      <strong>{incident.title}</strong>
      <span>{incident.category.name}</span>
    </div>
  );
};

export { IncidentTitleCell };
