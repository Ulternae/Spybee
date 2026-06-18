"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { MinaCheck, MinaChevronDown } from "@zcorvus/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./combobox.module.scss";

type ComboboxOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface MultiComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  renderChip?: (option: ComboboxOption) => React.ReactNode;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  size?: "sm" | "default";
  name?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  maxVisibleChips?: number;
  align?: ComponentProps<typeof PopoverPrimitive.Content>["align"];
  sideOffset?: ComponentProps<typeof PopoverPrimitive.Content>["sideOffset"];
}

type ComponentProps<T extends React.ElementType> = React.ComponentProps<T>;

function MultiCombobox({
  options,
  value,
  onValueChange,
  renderChip,
  renderOption,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  invalid = false,
  size = "default",
  name,
  className,
  triggerClassName,
  contentClassName,
  maxVisibleChips = 3,
  align = "start",
  sideOffset = 4,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const selectedOptions = React.useMemo(() => {
    return value
      .map((itemValue) => options.find((option) => option.value === itemValue))
      .filter(Boolean) as ComboboxOption[];
  }, [options, value]);

  const visibleOptions = selectedOptions.slice(0, maxVisibleChips);
  const hiddenCount = Math.max(selectedOptions.length - visibleOptions.length, 0);

  function updateOpen(nextOpen: boolean) {
    if (!disabled) {
      setOpen(nextOpen);
    }
  }

  function toggleValue(optionValue: string) {
    const nextValue = selectedSet.has(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onValueChange(nextValue);
  }

  function removeValue(optionValue: string) {
    onValueChange(value.filter((item) => item !== optionValue));
  }

  function clearValue() {
    onValueChange([]);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={updateOpen}>
      <div data-slot="multi-combobox" className={cn(styles.root, className)}>
        {name
          ? value.map((itemValue) => (
            <input key={itemValue} type="hidden" name={name} value={itemValue} />
          ))
          : null}

        <PopoverPrimitive.Trigger asChild>
          <div
            role="combobox"
            tabIndex={disabled ? undefined : 0}
            aria-expanded={open}
            aria-disabled={disabled}
            aria-invalid={invalid || undefined}
            data-slot="multi-combobox-trigger"
            data-size={size}
            data-disabled={disabled || undefined}
            data-placeholder={selectedOptions.length === 0 || undefined}
            translate="no"
            className={cn(styles.trigger, triggerClassName)}
            onKeyDown={handleTriggerKeyDown}
          >
            <div className={styles.value}>
              {selectedOptions.length > 0 ? (
                <div className={styles.chips}>
                  {visibleOptions.map((option) => (
                    <span key={option.value} className={styles.chip}>
                      <span className={styles.chipLabel}>
                        {renderChip ? renderChip(option) : option.label}
                      </span>

                      <button
                        type="button"
                        aria-label={`Remove ${option.label}`}
                        className={styles.chipRemove}
                        disabled={disabled}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeValue(option.value);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {hiddenCount > 0 ? (
                    <span className={styles.chip}>+{hiddenCount}</span>
                  ) : null}
                </div>
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </div>

            <MinaChevronDown aria-hidden="true" />
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-slot="multi-combobox-content"
            align={align}
            sideOffset={sideOffset}
            translate="no"
            className={cn(styles.content, contentClassName)}
          >
            <CommandPrimitive className={styles.command}>
              <CommandPrimitive.Input
                data-slot="multi-combobox-input"
                className={styles.input}
                placeholder={searchPlaceholder}
                translate="no"
                onKeyDown={(event) => {
                  if (
                    event.key === "Backspace" &&
                    event.currentTarget.value === "" &&
                    value.length > 0
                  ) {
                    removeValue(value[value.length - 1]);
                  }
                }}
              />

              <CommandPrimitive.List className={styles.list}>
                <CommandPrimitive.Empty className={styles.empty}>
                  {emptyMessage}
                </CommandPrimitive.Empty>

                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value);

                  return (
                    <CommandPrimitive.Item
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      data-slot="multi-combobox-item"
                      data-checked={isSelected || undefined}
                      className={styles.item}
                      onSelect={() => {
                        if (!option.disabled) {
                          toggleValue(option.value);
                        }
                      }}
                    >
                      <span className={styles.itemText}>
                        {renderOption ? renderOption(option) : option.label}
                      </span>

                      <span className={styles.indicator}>
                        {isSelected ? <MinaCheck /> : null}
                      </span>
                    </CommandPrimitive.Item>
                  );
                })}
              </CommandPrimitive.List>

              {value.length > 0 ? (
                <div className={styles.footer}>
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={clearValue}
                  >
                    Clear selection
                  </button>
                </div>
              ) : null}
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  );
}

export type { ComboboxOption, MultiComboboxProps };
export { MultiCombobox };
