import type { ReactNode } from "react";
import styles from "../../incident-form.module.scss";

interface IncidentFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const IncidentFormSection = ({
  title,
  description,
  children,
}: IncidentFormSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
};

export { IncidentFormSection };
export type { IncidentFormSectionProps };
