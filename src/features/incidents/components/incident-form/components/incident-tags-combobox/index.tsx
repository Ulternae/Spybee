import { MultiCombobox, type ComboboxOption } from "@/components/ui/combobox";
import type { IncidentFormTagOption } from "@/features/incidents/queries/get-incident-form-options";
import styles from "../../incident-form.module.scss";

type TagComboboxOption = ComboboxOption & {
  color: string | null;
};

interface IncidentTagsComboboxProps {
  name: string;
  tags: IncidentFormTagOption[];
  value: string[];
  disabled?: boolean;
  invalid?: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  onValueChange: (value: string[]) => void;
}

const getTagOptions = (tags: IncidentFormTagOption[]): TagComboboxOption[] => {
  return tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
    color: tag.color,
  }));
};

const renderTagContent = (option: ComboboxOption) => {
  const tag = option as TagComboboxOption;

  return (
    <span className={styles.tagOption}>
      {tag.color && (
        <span
          className={styles.tagDot}
          style={{ backgroundColor: tag.color }}
          aria-hidden="true"
        />
      )}
      <span>{tag.label}</span>
    </span>
  );
};

const IncidentTagsCombobox = ({
  name,
  tags,
  value,
  disabled,
  invalid,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  onValueChange,
}: IncidentTagsComboboxProps) => {
  return (
    <MultiCombobox
      name={name}
      options={getTagOptions(tags)}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={disabled}
      invalid={invalid}
      className={styles.combobox}
      triggerClassName={styles.comboboxTrigger}
      renderChip={renderTagContent}
      renderOption={renderTagContent}
    />
  );
};

export { IncidentTagsCombobox };
export type { IncidentTagsComboboxProps };
