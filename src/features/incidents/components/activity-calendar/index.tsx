"use client";

import { useTranslations } from "next-intl";
import type { IncidentActivityDay } from "../../queries/get-incidents-activity";
import styles from "./activity-calendar.module.scss";

interface ActivityCalendarProps {
  days: IncidentActivityDay[];
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
}

const getIntensity = (count: number) => {
  if (count >= 5) return "high";
  if (count >= 3) return "medium";
  if (count >= 1) return "low";

  return "empty";
};

const ActivityCalendar = ({
  days,
  selectedDate,
  onDateChange,
}: ActivityCalendarProps) => {
  const t = useTranslations("incidents.activity.calendar");
  const leadingEmptyDays = days[0]
    ? (new Date(`${days[0].date}T00:00:00`).getDay() + 6) % 7
    : 0;
  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </header>

      <div className={styles.grid}>
        {weekdays.map((weekday) => (
          <span key={weekday} className={styles.weekday}>
            {t(`weekdays.${weekday}`)}
          </span>
        ))}
        {Array.from({ length: leadingEmptyDays }, (_, index) => (
          <span key={`empty-${index}`} className={styles.emptyDay} />
        ))}
        {days.map((day) => {
          const isSelected = selectedDate === day.date;
          const intensity = getIntensity(day.count);

          return (
            <button
              key={day.date}
              type="button"
              className={styles.day}
              data-intensity={intensity}
              data-selected={isSelected || undefined}
              onClick={() => onDateChange(isSelected ? null : day.date)}
            >
              <span>{day.day}</span>
              {day.count > 0 && <strong>{day.count}</strong>}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export { ActivityCalendar };
export type { ActivityCalendarProps };
