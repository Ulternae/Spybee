import { UserAvatar } from "@/components/common/user-avatar";
import type { IncidentTableUser } from "@/features/incidents/queries/get-incidents-table";
import styles from "../../incidents-table.module.scss";

interface IncidentParticipantsCellProps {
  users: IncidentTableUser[];
}

const MAX_VISIBLE_USERS = 3;

const IncidentParticipantsCell = ({ users }: IncidentParticipantsCellProps) => {
  if (users.length === 0) {
    return <span className={styles.emptyValue}>-</span>;
  }

  const visibleUsers = users.slice(0, MAX_VISIBLE_USERS);
  const hiddenUsersCount = users.length - visibleUsers.length;

  return (
    <div className={styles.participants}>
      {visibleUsers.map((user) => (
        <UserAvatar
          key={user.id}
          name={user.name}
          image={user.image}
          size="sm"
          title={user.name}
          className={styles.avatar}
        />
      ))}
      {hiddenUsersCount > 0 && (
        <span className={styles.moreUsers}>+{hiddenUsersCount}</span>
      )}
    </div>
  );
};

export { IncidentParticipantsCell };
