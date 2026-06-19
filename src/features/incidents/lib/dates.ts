import { addDays, endOfMonth, startOfDay, startOfMonth, subDays } from "date-fns";

const getRelativeDayBoundaries = (now = new Date()) => {
  const todayStart = startOfDay(now);

  return {
    now,
    todayStart,
    tomorrowStart: addDays(todayStart, 1),
    sevenDaysAgoStart: subDays(todayStart, 7),
    last30DaysStart: subDays(todayStart, 29),
    next7DaysEnd: addDays(todayStart, 7),
  };
};

const getMonthBoundaries = (date = new Date()) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return {
    monthStart,
    monthEnd,
  };
};

export { getMonthBoundaries, getRelativeDayBoundaries };
