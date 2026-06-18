import { UserAvatar } from "@/components/common/user-avatar";
import { MultiCombobox, type ComboboxOption } from "@/components/ui/combobox";
import type { IncidentFormUserOption } from "@/features/incidents/queries/get-incident-form-options";
import styles from "../../incident-form.module.scss";

type UserComboboxOption = ComboboxOption & {
  email: string;
  image: string | null;
};

interface IncidentUsersComboboxProps {
  name: string;
  users: IncidentFormUserOption[];
  value: string[];
  disabled?: boolean;
  invalid?: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  onValueChange: (value: string[]) => void;
}

const getUserOptions = (
  users: IncidentFormUserOption[],
): UserComboboxOption[] => {
  return users.map((user) => ({
    label: user.name,
    value: user.id,
    email: user.email,
    image: user.image,
  }));
};

const renderUserOption = (option: ComboboxOption) => {
  const user = option as UserComboboxOption;

  return (
    <span className={styles.userOption}>
      <UserAvatar
        name={user.label}
        image={user.image}
        className={styles.userAvatar}
      />
      <span className={styles.userContent}>
        <span>{user.label}</span>
        <small>{user.email}</small>
      </span>
    </span>
  );
};

const renderUserChip = (option: ComboboxOption) => {
  const user = option as UserComboboxOption;

  return (
    <span className={styles.userChip}>
      <UserAvatar
        name={user.label}
        image={user.image}
        className={styles.userChipAvatar}
      />
      <span>{user.label}</span>
    </span>
  );
};

const IncidentUsersCombobox = ({
  name,
  users,
  value,
  disabled,
  invalid,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  onValueChange,
}: IncidentUsersComboboxProps) => {
  return (
    <MultiCombobox
      name={name}
      options={getUserOptions(users)}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={disabled}
      invalid={invalid}
      className={styles.combobox}
      triggerClassName={styles.comboboxTrigger}
      maxVisibleChips={2}
      renderChip={renderUserChip}
      renderOption={renderUserOption}
    />
  );
};

export { IncidentUsersCombobox };
export type { IncidentUsersComboboxProps };
