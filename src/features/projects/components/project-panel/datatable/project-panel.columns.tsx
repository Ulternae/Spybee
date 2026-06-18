import type { ColumnDef } from "@tanstack/react-table";
import { DatatableSorting } from "@/components/ui/data-table-sorting";
import type { ProjectDetailMember } from "@/features/projects/queries/get-project-detail";
import { ProjectActionsCell } from "./project-actions";
import { ProjectNameCell } from "./project-name";
import { ProjectRoleCell } from "./project-role";

interface GetProjectPanelColumnsInput {
  projectId: string;
  canManageProjectMembers: boolean;
}

const getProjectPanelColumns = ({ projectId, canManageProjectMembers, }: GetProjectPanelColumnsInput): ColumnDef<ProjectDetailMember>[] => [
  {
    id: "name",
    accessorKey: "user.name",
    minSize: 200,
    header: ({ column }) => <DatatableSorting name="name" column={column} />,
    cell: ({ row }) => <ProjectNameCell member={row.original} />,
  },
  {
    id: "role",
    accessorKey: "role",
    minSize: 180,
    header: ({ column }) => <DatatableSorting name="role" column={column} />,
    cell: ({ row }) => (
      <ProjectRoleCell
        member={row.original}
        projectId={projectId}
        canManageProjectMembers={canManageProjectMembers}
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
      <ProjectActionsCell
        member={row.original}
        projectId={projectId}
        canManageProjectMembers={canManageProjectMembers}
      />
    ),
  },
];

export { getProjectPanelColumns };
