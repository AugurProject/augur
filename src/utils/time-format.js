// Lifted from here: https://bl.ocks.org/wboykinm/34627426d84f3242e0e6ecb2339e9065
import * as d3 from "d3";

const formatMillisecond = d3.timeFormat(".%L");
const formatSecond = d3.timeFormat(":%S");
const formatMinute = d3.timeFormat("%I:%M");
const formatHour = d3.timeFormat("%I %p");
const formatDay = d3.timeFormat("%a %d");
const formatWeek = d3.timeFormat("%b %d");
const formatMonth = d3.timeFormat("%B");
const formatYear = d3.timeFormat("%Y");

export const formatTick = d3.timeFormat("%a %d %Y");

// Define filter conditions
export function timeFormat(date) {
  let f;

  if (d3.timeSecond(date) < date) f = formatMillisecond;
  if (d3.timeMinute(date) < date) f = formatSecond;
  if (d3.timeHour(date) < date) f = formatMinute;
  if (d3.timeDay(date) < date) f = formatHour;
  if (d3.timeMonth(date) < date) {
    if (d3.timeWeek(date) < date) {
      f = formatDay;
    } else {
      f = formatWeek;
    }
  } else if (d3.timeYear(date) < date) {
    f = formatMonth;
  } else {
    f = formatYear;
  }

  return f(date);
}
