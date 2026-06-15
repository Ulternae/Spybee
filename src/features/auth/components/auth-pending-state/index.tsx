import { MinaSpinner } from "@zcorvus/icons-react";
import { cn } from "@/lib/utils/cn";
import styles from "./auth-pending-state.module.scss";

interface AuthPendingStateProps {
  className?: string;
  label: string;
}

const AuthPendingState = ({ className, label }: AuthPendingStateProps) => {
  return (
    <div className={cn(styles.root, className)} role="status" aria-label={label}>
      <MinaSpinner aria-hidden="true" className={styles.spinner} />
    </div>
  );
};

export { AuthPendingState };
