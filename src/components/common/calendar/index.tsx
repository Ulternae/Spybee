"use client";

import { format, isSameYear } from "date-fns";
import { useTranslations } from "next-intl";
import type React from "react";
import { type FC, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOURS, QUICK_DATES, type HourOption } from "./constants";
import styles from "./calendar.module.scss";
import { MinaCalendar } from "@zcorvus/icons-react";

export type { HourOption };

export interface HandleDateChange {
  newDate: Date;
  newHour: HourOption;
}

interface CalendarProps {
  onDateChange: ({ newDate, newHour }: HandleDateChange) => void;
  date: Date | undefined;
  hour: HourOption;
  children: React.ReactNode;
}

const formatDate = (date: Date): string => {
  return isSameYear(date, new Date())
    ? format(date, "MMM. d")
    : format(date, "dd/MM/yyyy");
};

const Calendar: FC<CalendarProps> = ({
  date,
  hour,
  onDateChange,
  children,
}) => {
  const t = useTranslations("calendar");

  const handleSelectDate = useCallback(
    (selectedDate?: Date) => {
      if (!selectedDate) return;

      onDateChange({ newDate: selectedDate, newHour: hour });
    },
    [hour, onDateChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className={styles.content} align="end">
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <MinaCalendar
                  type="mina"
                  name="calendar"
                  className={styles.icon}
                />
              </div>

              <Input
                placeholder={t("picker.select_date")}
                value={date ? formatDate(date) : ""}
                readOnly
                className={styles.input}
              />
            </div>

            <Select
              value={hour.value}
              onValueChange={(value) => {
                const selectedHour = HOURS.find(
                  (option) => option.value === value,
                );

                if (date && selectedHour) {
                  onDateChange({ newDate: date, newHour: selectedHour });
                }
              }}
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="00:00" />
              </SelectTrigger>

              <SelectContent>
                {HOURS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ul className={styles.quickDates}>
              {QUICK_DATES.map((item) => (
                <li key={item.labelKey}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={styles.quickDateButton}
                    onClick={() => handleSelectDate(item.date.toDate())}
                  >
                    <span className={styles.quickDateLabel}>
                      {t(`picker.quick_dates.${item.labelKey}`)}
                    </span>

                    <span className={styles.quickDateDisplay}>
                      {item.display}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.calendarPanel}>
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
              className={styles.calendarUi}
              classNames={{
                caption_label: styles.calendarCaptionLabel,
                weekday: styles.calendarWeekday,
                day: styles.calendarDay,
                day_button: styles.calendarDayButton,
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { Calendar };