import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  format,
  isSaturday,
  nextSaturday,
  startOfDay,
  startOfWeek,
} from "date-fns";

type DateWithToDate = Date & {
  toDate: () => Date;
};

type QuickDate = {
  labelKey:
  | "today"
  | "later_today"
  | "tomorrow"
  | "this_weekend"
  | "next_week"
  | "next_weekend"
  | "two_weeks"
  | "four_weeks";
  date: DateWithToDate;
  display: string;
};

type HourOption = {
  label: string;
  value: string;
};

const withToDate = (date: Date): DateWithToDate => {
  return Object.assign(date, {
    toDate: () => new Date(date),
  });
};

const formatQuickDay = (date: Date) => format(date, "EEE");
const formatQuickDate = (date: Date) => format(date, "d MMM");
const formatQuickTime = (date: Date) => format(date, "h:mm a");

const getUpcomingSaturday = (date: Date): Date => {
  return isSaturday(date) ? date : nextSaturday(date);
};

const now = new Date();
const today = startOfDay(now);
const thisWeekend = getUpcomingSaturday(now);
const nextWeek = addDays(startOfWeek(addWeeks(now, 1), { weekStartsOn: 0 }), 1);
const nextWeekend = addWeeks(thisWeekend, 1);

export const QUICK_DATES: QuickDate[] = [
  {
    labelKey: "today",
    date: withToDate(now),
    display: formatQuickDay(now),
  },
  {
    labelKey: "later_today",
    date: withToDate(addHours(now, 2)),
    display: formatQuickTime(addHours(now, 2)),
  },
  {
    labelKey: "tomorrow",
    date: withToDate(addDays(today, 1)),
    display: formatQuickDay(addDays(today, 1)),
  },
  {
    labelKey: "this_weekend",
    date: withToDate(thisWeekend),
    display: formatQuickDay(thisWeekend),
  },
  {
    labelKey: "next_week",
    date: withToDate(nextWeek),
    display: formatQuickDay(nextWeek),
  },
  {
    labelKey: "next_weekend",
    date: withToDate(nextWeekend),
    display: formatQuickDate(nextWeekend),
  },
  {
    labelKey: "two_weeks",
    date: withToDate(addWeeks(now, 2)),
    display: formatQuickDate(addWeeks(now, 2)),
  },
  {
    labelKey: "four_weeks",
    date: withToDate(addWeeks(now, 4)),
    display: formatQuickDate(addWeeks(now, 4)),
  },
];

export const HOURS: HourOption[] = Array.from({ length: 96 }, (_, index) => {
  const date = addMinutes(startOfDay(new Date()), index * 15);

  return {
    label: format(date, "h:mm a"),
    value: format(date, "HH:mm:ss"),
  };
});

export type { HourOption, QuickDate };
