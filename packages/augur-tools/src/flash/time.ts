export function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function addMonths(date: Date, months: number): Date {
  const targetMonth = date.getMonth() + months;
  const year = date.getFullYear() + targetMonth / 12;
  const month = targetMonth % 12;
  let day = date.getDate();
  const lastDay = daysInMonth(year, month);
  if (day > lastDay) {
    day = lastDay;
  }
  return new Date(year, month, day);
}

export const midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);
export const closingBellTomorrow = new Date();
closingBellTomorrow.setDate(closingBellTomorrow.getDate() + 1);
closingBellTomorrow.setHours(20, 0, 0, 0);
export const today = new Date();
// needs to be less than 90 days. todo: update when contracts allow for 6 months
today.setDate(today.getDate() - 3);
export const inOneMonths = addMonths(today, 1);
export const inTwoMonths = addMonths(today, 2);
export const inThreeMonths = addMonths(today, 3);
export const inFourMonths = addMonths(today, 4);
export const inFiveMonths = addMonths(today, 5);
export const inSixMonths = addMonths(today, 6);
export const inTenMonths = addMonths(today, 10);
export const thisYear = today.getUTCFullYear();

