import { UserAvatar } from "@/components/common/user-avatar";
import type { ProjectDetailMember } from "@/features/projects/queries/get-project-detail";
import styles from "./project-name.module.scss";

interface ProjectNameCellProps {
  member: ProjectDetailMember;
}

const ProjectNameCell = ({ member }: ProjectNameCellProps) => {
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

export { ProjectNameCell };
