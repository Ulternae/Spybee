import { useLocale, useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { IncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";
import type { IncidentTableItem } from "@/features/incidents/queries/get-incidents-table";
import { IncidentActionsCell } from "./incident-actions";
import { IncidentParticipantsCell } from "./incident-participants";
import { IncidentTitleCell } from "./incident-title";
import styles from "../incidents-table.module.scss";

interface UseIncidentsTableColumnsInput {
  canUpdateIncidents: boolean;
  options: IncidentFormOptions;
  onEditSuccess: () => void;
}

const formatSequenceNo = (sequenceNo: number) => {
  return `#${String(sequenceNo).padStart(4, "0")}`;
};

const useIncidentsTableColumns = ({ canUpdateIncidents, options, onEditSuccess }: UseIncidentsTableColumnsInput): ColumnDef<IncidentTableItem>[] => {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tIncidents = useTranslations("incidents.table");
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return [
    {
      id: "sequenceNo",
      accessorKey: "sequenceNo",
      minSize: 90,
      header: tIncidents("columns.id"),
      cell: ({ row }) => (
        <span className={styles.sequence}>
          {formatSequenceNo(row.original.sequenceNo)}
        </span>
      ),
    },
    {
      id: "title",
      accessorKey: "title",
      minSize: 260,
      header: tCommon("fields.title"),
      cell: ({ row }) => <IncidentTitleCell incident={row.original} />,
    },
    {
      id: "priority",
      accessorKey: "priority",
      minSize: 130,
      header: tCommon("fields.priority"),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={styles.badge}
          data-tone={row.original.priority.toLowerCase()}
        >
          {tCommon(`enums.incident_priority.${row.original.priority}`)}
        </Badge>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      minSize: 130,
      header: tCommon("fields.state"),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={styles.badge}
          data-tone={row.original.status.toLowerCase()}
        >
          {tCommon(`enums.incident_status.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      id: "assignees",
      accessorKey: "assignees",
      minSize: 140,
      header: tCommon("fields.assignees"),
      cell: ({ row }) => (
        <IncidentParticipantsCell users={row.original.assignees} />
      ),
      enableSorting: false,
    },
    {
      id: "createdBy",
      accessorKey: "createdBy.name",
      minSize: 180,
      header: tIncidents("columns.created_by"),
      cell: ({ row }) =>
        row.original.createdBy?.name ?? (
          <span className={styles.emptyValue}>-</span>
        ),
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      minSize: 150,
      header: tCommon("fields.due_date"),
      cell: ({ row }) =>
        row.original.dueDate ? (
          dateFormatter.format(new Date(row.original.dueDate))
        ) : (
          <span className={styles.emptyValue}>{tIncidents("no_due_date")}</span>
        ),
    },
    {
      id: "actions",
      minSize: 22,
      maxSize: 22,
      size: 22,
      header: "",
      cell: ({ row }) => (
        <IncidentActionsCell
          incident={row.original}
          canUpdateIncidents={canUpdateIncidents}
          options={options}
          onEditSuccess={onEditSuccess}
        />
      ),
    },
  ];
};

export { useIncidentsTableColumns };
