import { UserAvatar } from "@/components/common/user-avatar";
import type { OrganizationDetailMember } from "@/features/organizations/queries/get-organization-detail";
import styles from "./organization-name.module.scss";

interface OrganizationNameCellProps {
  member: OrganizationDetailMember;
}

const OrganizationNameCell = ({ member }: OrganizationNameCellProps) => {
  return (
    <div className={styles.root}>
      <UserAvatar
        className={styles.avatar}
        size="sm"
        name={member.user.name}
        image={member.user.image}
      />
      <div className={styles.content}>
        <p className={styles.name}>{member.user.name}</p>
        <p className={styles.email}>{member.user.email}</p>
      </div>
    </div>
  );
};

export { OrganizationNameCell };
