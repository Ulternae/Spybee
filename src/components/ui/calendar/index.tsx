"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import styles from "./calendar.module.scss";
import { MinaChevronDown, MinaChevronLeft, MinaChevronRight } from "@zcorvus/icons-react";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

function getNavButtonVariantClassName(variant: ButtonVariant) {
  switch (String(variant ?? "ghost")) {
    case "default":
      return styles.navButtonDefault;
    case "secondary":
      return styles.navButtonSecondary;
    case "outline":
      return styles.navButtonOutline;
    case "destructive":
      return styles.navButtonDestructive;
    case "link":
      return styles.navButtonLink;
    case "ghost":
    default:
      return styles.navButtonGhost;
  }
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: ButtonVariant;
}) {
  const defaultClassNames = getDefaultClassNames();
  const navButtonVariantClassName = getNavButtonVariantClassName(buttonVariant);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.calendar, className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(styles.root, defaultClassNames.root, classNames?.root),
        months: cn(styles.months, defaultClassNames.months, classNames?.months),
        month: cn(styles.month, defaultClassNames.month, classNames?.month),
        nav: cn(styles.nav, defaultClassNames.nav, classNames?.nav),

        button_previous: cn(
          styles.navButton,
          styles.buttonPrevious,
          navButtonVariantClassName,
          defaultClassNames.button_previous,
          classNames?.button_previous,
        ),

        button_next: cn(
          styles.navButton,
          styles.buttonNext,
          navButtonVariantClassName,
          defaultClassNames.button_next,
          classNames?.button_next,
        ),

        month_caption: cn(
          styles.monthCaption,
          defaultClassNames.month_caption,
          classNames?.month_caption,
        ),

        dropdowns: cn(
          styles.dropdowns,
          defaultClassNames.dropdowns,
          classNames?.dropdowns,
        ),

        dropdown_root: cn(
          styles.dropdownRoot,
          defaultClassNames.dropdown_root,
          classNames?.dropdown_root,
        ),

        dropdown: cn(
          styles.dropdown,
          defaultClassNames.dropdown,
          classNames?.dropdown,
        ),

        caption_label: cn(
          styles.captionLabel,
          captionLayout === "label"
            ? styles.captionLabelDefault
            : styles.captionLabelDropdown,
          defaultClassNames.caption_label,
          classNames?.caption_label,
        ),

        weekdays: cn(styles.weekdays, defaultClassNames.weekdays, classNames?.weekdays),
        weekday: cn(styles.weekday, defaultClassNames.weekday, classNames?.weekday),
        week: cn(styles.week, defaultClassNames.week, classNames?.week),

        week_number_header: cn(
          styles.weekNumberHeader,
          defaultClassNames.week_number_header,
          classNames?.week_number_header,
        ),

        week_number: cn(
          styles.weekNumber,
          defaultClassNames.week_number,
          classNames?.week_number,
        ),

        day: cn(
          styles.day,
          props.showWeekNumber
            ? styles.dayWithWeekNumber
            : styles.dayWithoutWeekNumber,
          defaultClassNames.day,
          classNames?.day,
        ),

        day_button: cn(classNames?.day_button),

        range_start: cn(
          styles.rangeStart,
          defaultClassNames.range_start,
          classNames?.range_start,
        ),

        range_middle: cn(
          styles.rangeMiddle,
          defaultClassNames.range_middle,
          classNames?.range_middle,
        ),

        range_end: cn(
          styles.rangeEnd,
          defaultClassNames.range_end,
          classNames?.range_end,
        ),

        today: cn(styles.today, defaultClassNames.today, classNames?.today),
        outside: cn(styles.outside, defaultClassNames.outside, classNames?.outside),
        disabled: cn(styles.disabled, defaultClassNames.disabled, classNames?.disabled),
        hidden: cn(styles.hidden, defaultClassNames.hidden, classNames?.hidden),
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <MinaChevronLeft
                className={cn(styles.chevron, className)}
                {...props}
              />
            );
          }

          if (orientation === "right") {
            return (
              <MinaChevronRight
                className={cn(styles.chevron, className)}
                {...props}
              />
            );
          }

          return (
            <MinaChevronDown
              className={cn(styles.chevron, className)}
              {...props}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className={styles.weekNumberCell}>{children}</div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        styles.dayButton,
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };