import { ProjectRole } from "@/generated/prisma/enums";
import type { ProjectRole as ProjectRoleType } from "@/generated/prisma/enums";

const PROJECT_MEMBER_ROLES = [
  ProjectRole.PROJECT_ADMIN,
  ProjectRole.EDITOR,
  ProjectRole.VIEWER,
] as const;

const isProjectMemberRole = (role: string): role is ProjectRoleType => {
  return PROJECT_MEMBER_ROLES.includes(role as ProjectRoleType);
};

export { PROJECT_MEMBER_ROLES, isProjectMemberRole };
export type { ProjectRoleType };
