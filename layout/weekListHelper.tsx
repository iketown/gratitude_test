import {
  add,
  endOfDay,
  endOfWeek,
  format,
  getWeeksInMonth,
  isBefore,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getMonthsObj = () => {
  const today = endOfDay(new Date());
  const thisWeekEnd = endOfWeek(today);
  const fourMonthsAgo = startOfWeek(add(today, { months: -4 }));

  let weekToInsert = fourMonthsAgo;

  const months: { [month: string]: Date[] } = {};

  //!months obj
  let monthToInsert = startOfMonth(fourMonthsAgo);

  const months_obj: {
    [month_id: string]: {
      weeks: Date[][];
    };
  } = {};

  while (isBefore(monthToInsert, thisWeekEnd)) {
    const month_id = format(monthToInsert, "yyyy-MM-dd");
    const weeksInMonth = getWeeksInMonth(monthToInsert);
    const weeks = Array.from({ length: weeksInMonth }).map((_, i) => {
      const weekStart = add(startOfWeek(monthToInsert), { weeks: i });
      const days = Array.from({ length: 7 }).map((_, i) => {
        return add(weekStart, { days: i });
      });
      return days;
    });
    months_obj[month_id] = { weeks };
    //

    monthToInsert = add(monthToInsert, { months: 1 });
  }

  //
  //
  while (isBefore(weekToInsert, thisWeekEnd)) {
    const monthStart = format(startOfMonth(weekToInsert), "yyyy-MM-dd");
    if (months[monthStart]) {
      months[monthStart].push(weekToInsert);
    } else {
      if (isBefore(startOfMonth(weekToInsert), weekToInsert)) {
        months[monthStart] = [startOfMonth(weekToInsert), weekToInsert];
      } else {
        months[monthStart] = [weekToInsert];
      }
    }

    weekToInsert = add(weekToInsert, { weeks: 1 });
  }

  return months_obj;
};
