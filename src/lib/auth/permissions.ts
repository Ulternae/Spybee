import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statements = {
  ...defaultStatements,

  project: ["create"]

} as const;

const ac = createAccessControl(statements);

const owner = ac.newRole({
  ...ownerAc.statements,
  project: ["create"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create"],
});

const member = ac.newRole({
  ...memberAc.statements,
  project: [],
});

const organizationRoles = {
  owner,
  admin,
  member,
};

export { ac, admin, member, organizationRoles, owner, statements };
export type OrganizationRole = keyof typeof organizationRoles;