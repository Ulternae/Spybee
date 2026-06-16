import { useTranslations } from "next-intl";
import styles from "./form-errors.module.scss";

interface FormErrorsProps<TField extends string> {
  fieldErrors?: Partial<Record<TField, string[]>>;
  formError?: string;
}

const FormErrors = <TField extends string>({ fieldErrors, formError }: FormErrorsProps<TField>) => {

  const common = useTranslations("common.fields")
  const error = useTranslations("error")

  const entries = Object.entries(fieldErrors ?? {}) as [TField, string[]][];

  if (entries.length === 0 && !formError) {
    return null;
  }

  return (
    <div className={styles.root} role="alert" aria-live="polite">
      {entries.map(([field, messages]) => (
        <div className={styles.error} key={field}>
          <span className={styles.label}>{common.has(field) ? common(String(field)) : String(field)}</span>
          <ul className={styles.messages}>
            {messages.map((message) => (
              <li key={message}>{error.has(message) ? error(message) : message}</li>
            ))}
          </ul>
        </div>
      ))}


      {formError && (
        <div className={styles.error}>
          <span className={styles.label}>{common("error")}</span>
          <p className={styles.messages}>
            {error.has(formError) ? error(formError) : error("GENERIC_ERROR")}
          </p>
        </div>
      )}
    </div>
  );
};

export { FormErrors };
