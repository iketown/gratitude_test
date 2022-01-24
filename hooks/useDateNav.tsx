import { useRouter } from "next/router";
import { format, getMonth, getWeek, getYear } from "date-fns";

export const useDateNav = () => {
  const { push, query } = useRouter();

  const goToDate = (year: number, week: number, date_id?: string) => {
    if (date_id)
      return push(
        `/weeks/[year]/[week]?date=${date_id}`,
        `/weeks/${year}/${week}?date=${date_id}`
      );
    push("/weeks/[year]/[week]", `/weeks/${year}/${week}`);
  };
  const goToToday = () => {
    const today = new Date();
    const year = getYear(today);
    const week = getWeek(today);
    const date_id = format(today, "yyyy-MM-dd");
    goToDate(year, week, date_id);
  };

  const goToDateId = (date_id: string) => {
    const date = new Date(`${date_id}T00:00`);
    const year = getYear(date);
    const week = getWeek(date);
    goToDate(year, week, date_id);
  };

  const thisIsToday =
    query.date && query.date === format(new Date(), "yyyy-MM-dd");

  return { goToDate, goToToday, goToDateId, thisIsToday };
};
