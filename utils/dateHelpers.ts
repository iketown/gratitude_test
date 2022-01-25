import { startOfWeek, endOfWeek, format, add } from "date-fns";

export const getDates = ({ year, week }: { year: string; week: string }) => {
  if (typeof year !== "string" || typeof week !== "string") return {};
  const yearStart = new Date(`${year}-01-01T00:00`);
  const yearNum = Number(year);
  const weekNum = Number(week);
  const weekStart = startOfWeek(add(yearStart, { weeks: weekNum - 1 }));

  const dateFormat = "yyyy-MM-dd";
  const weekEnd = endOfWeek(weekStart);
  const startDate = format(weekStart, dateFormat);
  const endDate = format(weekEnd, dateFormat);
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const thisDay = add(weekStart, { days: i });
    return format(thisDay, dateFormat);
  });
  return { dates, startDate, endDate };
};
