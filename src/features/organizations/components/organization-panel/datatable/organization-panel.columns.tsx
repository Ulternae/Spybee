import type { ColumnDef } from "@tanstack/react-table";
import { DatatableSorting } from "@/components/ui/data-table-sorting";
import type { OrganizationDetailMember } from "@/features/organizations/queries/get-organization-detail";
import { OrganizationActionsCell } from "./organization-actions";
import { OrganizationNameCell } from "./organization-name";
import { OrganizationRoleCell } from "./organization-role";

interface GetOrganizationPanelColumnsInput {
  organizationId: string;
  canManageMembers: boolean;
}

const getOrganizationPanelColumns = ({ organizationId, canManageMembers }: GetOrganizationPanelColumnsInput): ColumnDef<OrganizationDetailMember>[] => [
  {
    id: "name",
    accessorKey: "user.name",
    minSize: 200,
    header: ({ column }) => <DatatableSorting name="name" column={column} />,
    cell: ({ row }) => <OrganizationNameCell member={row.original} />,
  },
  {
    id: "role",
    accessorKey: "role",
    minSize: 180,
    header: ({ column }) => <DatatableSorting name="role" column={column} />,
    cell: ({ row }) => (
      <OrganizationRoleCell
        member={row.original}
        organizationId={organizationId}
        canManageMembers={canManageMembers}
      />
    ),
  },
  {
    id: "actions",
    minSize: 22,
    maxSize: 22,
    size: 22,
    header: "",
    cell: ({ row }) => (
      <OrganizationActionsCell
        member={row.original}
        organizationId={organizationId}
        canManageMembers={canManageMembers}
      />
    ),
  },
];

export { getOrganizationPanelColumns };
