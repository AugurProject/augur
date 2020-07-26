import moment from 'moment';
import { DateFormattedObject, TimezoneDateObject, DateTimeComponents } from 'modules/types';
import { createBigNumber } from './create-big-number';
import { ZERO, DAYS_AFTER_END_TIME_ORDER_EXPIRATION } from 'modules/common/constants';
import { getMaxMarketEndTime } from 'modules/contracts/actions/contractCalls';
import { number } from 'prop-types';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const NUMBER_OF_SECONDS_IN_A_DAY = 86400;
const HOURS_IN_A_DAY = 24;
const MINUTES_IN_A_HOUR = 60;

export function formatDate(d, timezone: string = null): DateFormattedObject {
  const date: Date = d instanceof Date ? d : new Date(0);

  // UTC Time Formatting
  const utcTime: number[] = [date.getUTCHours(), date.getUTCMinutes()];
  const utcTimeTwelve: string[] = getTwelveHourTime(utcTime);
  const utcTimeWithSeconds: string[] = [
    ('0' + date.getUTCHours()).slice(-2),
    ('0' + date.getUTCMinutes()).slice(-2),
    ('0' + date.getUTCSeconds()).slice(-2),
  ];
  const utcAMPM: string = ampm(('0' + date.getUTCHours()).slice(-2));

  // Locat Time Formatting
  const local24hrTimeWithSeconds: number[] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const localAMPM: string = ampm(local24hrTimeWithSeconds[0].toString());
  const localTimeTwelve: string[] = getTwelveHourTime(local24hrTimeWithSeconds);
  const localOffset: number = (date.getTimezoneOffset() / 60) * -1;
  const localOffsetFormatted: string =
    localOffset > 0 ? `+${localOffset}` : localOffset.toString();
  const timezoneLocal: string = timezone
    ? date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      })
    : date.toLocaleTimeString('en-us', { timeZoneName: 'short' });
  const timezoneName: string = `(${timezoneLocal.split(' ')[2]})`;

  return {
    value: date,
    formattedUtcShortTime: `${utcTimeWithSeconds.join(':')}`,
    formattedShortTime: `${convertTwoDigitValues(local24hrTimeWithSeconds).join(':')}`,
    formattedLocalShortDateSecondary: `${date.getDate()} ${
      shortMonths[date.getMonth()]
    } ${date.getFullYear()}`,
    formattedLocalShortDate: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`,
    formattedLocalShortWithUtcOffset: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ':'
    )} ${localAMPM} (UTC ${localOffsetFormatted})`,
    timestamp: date.getTime() / 1000,
    utcLocalOffset: localOffset,
    clockTimeLocal: `${localTimeTwelve.join(
      ':'
    )} ${localAMPM} (UTC ${localOffsetFormatted})`,
    formattedSimpleData: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`,
    formattedUtcShortDate: `${
      shortMonths[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()}`,
    clockTimeUtc: `${utcTimeTwelve.join(':')} ${utcAMPM} - UTC`,
    formattedLocalShortDateTimeWithTimezone: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ':'
    )} ${localAMPM} ${timezoneName}`,
    formattedLocalShortDateTimeNoTimezone: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()} ${convertTwoDigitValues(local24hrTimeWithSeconds).join(
      ':'
    )}`,
    formattedUtc: `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()} ${utcTimeTwelve.join(
      ':'
    )} ${utcAMPM} (UTC 0)`,
    formattedShortUtc: `${
      shortMonths[date.getUTCMonth()]
    } ${date.getUTCDate()} ${date.getUTCFullYear()} ${utcTimeTwelve.join(':')} ${utcAMPM} (UTC)`,
  };
}

const convertTwoDigitValues = (values: number[]) => values.map(v => `0${v}`.slice(-2));
function ampm(time: string): string {
  const value = parseInt(time, 10);
  return value < 12 ? 'AM' : 'PM';
}

function convertToTwelveHour(value: number): number {
  const hour = value < 12 ? value : value - 12;
  return hour || 12;
}

function getTwelveHourTime(time: number[]): string[] {
  const values: string[] = new Array(2);
  values[0] = convertToTwelveHour(time[0]).toString();
  values[1] = time[1].toString();
  if (time[1] < 10) values[1] = '0' + time[1];

  return values;
}

function getTimezoneAbbr(date: Date, timezone: string): string {
  if (!timezone) return '';
  let timezoneLocal = "";
  try {
    timezoneLocal = date.toLocaleTimeString('en-US', {
      timeZone: timezone.replace(' ', '_'),
      timeZoneName: 'short',
    });
  } catch(e){
    console.log("could not find timezone", timezone);
  }
  return timezoneLocal.split(' ')[2];
}
const LONG_FORMAT = 'MMMM DD, YYYY h:mm A';

export function buildformattedDate(
  timestamp: number,
  hour: number,
  minute: number,
  meridiem: string,
  timezone: string,
  offset: number
): TimezoneDateObject {

  let adjHour = Number(hour);
  const day = moment
    .unix(timestamp)
    .startOf('day').format('MMMM DD, YYYY');

  if (meridiem && meridiem === 'PM' && adjHour < 12) {
    adjHour = adjHour + 12;
  }

  // MMMM DD, YYYY h:mm A;
  const datetimeFormat = `${day} ${adjHour}:${minute} ${meridiem}`;
  const endTime = moment.utc(datetimeFormat, LONG_FORMAT);

  const abbr = getTimezoneAbbr(endTime.toDate(), timezone);
  const timezoneFormat = endTime.format(LONG_FORMAT);
  const formattedLocalShortDateTimeWithTimezone = `${timezoneFormat} (${abbr})`;

  const adjOffset = createBigNumber(offset || ZERO).times("-1").toNumber();
  endTime.add(adjOffset, 'hours');

  const utcFormat = endTime.format(LONG_FORMAT);
  const formattedUtc = `${utcFormat} (UTC 0)`;

  return {
    formattedUtc: formattedUtc,
    formattedLocalShortDateTimeWithTimezone: formattedLocalShortDateTimeWithTimezone,
    timestamp: endTime.unix(),
  };
}

export function timestampComponents(timestamp: number, offset: number = 0, timezone: string = null): Partial<DateTimeComponents> {
  // using local mode with moment, manually adjusting for offset
  const date = moment.unix(timestamp).add(offset, 'hours');
  return {
    setEndTime: timestamp,
    hour: String(date.utc().format('h')),
    minute: String(date.utc().format('mm')),
    meridiem: String(date.utc().format('A')),
    timezone
  }
}

// adjust for local time, need input value in UTC
export function getUtcStartOfDayFromLocal(timestamp: number): number {
  const value = moment
    .unix(timestamp)
    .startOf('day')
    .unix();
    return value;
}

export function convertUnixToFormattedDate(integer: number = 0) {
  return formatDate(moment.unix(integer).toDate());
}

export function convertSaltToFormattedDate(integer: number = 0) {
  return formatDate(moment(integer).toDate());
}

export function getBeginDate(
  currentAugurTimestampInMilliseconds: number,
  periodString: string
): number | null {
  const date = moment(currentAugurTimestampInMilliseconds);
  let beginDate = date.subtract(1, 'day');
  if (periodString === 'week') {
    beginDate = date.subtract(7, 'day');
  }
  if (periodString === 'month') {
    beginDate = date.subtract(1, 'month');
  }
  if (periodString === 'all') {
    return null;
  }
  return beginDate.unix();
}

export function startOfTomorrow(unixTimestamp: number): number {
  return moment
    .unix(unixTimestamp)
    .add(1, 'day')
    .startOf('day')
    .unix();
}

export function datesOnSameDay(firstUnixTimestamp, utcUnixTimestamp) {
  const startDate = moment.unix(firstUnixTimestamp).utc().startOf('day').unix();
  const endDate = moment.unix(utcUnixTimestamp).utc().startOf('day').unix();
  return  startDate === endDate;
}

export function minMarketEndTimeDay(currentTimestamp) {
  return moment.unix(currentTimestamp).startOf('day');
}

export function dateHasPassed(
  currentAugurTimestampInMilliseconds: number,
  unixTimestamp: number
): boolean {
  const date = moment(currentAugurTimestampInMilliseconds).utc();
  return date.unix() > unixTimestamp;
}

export function getDaysRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY);
}

export function getHoursRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(
    (remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY) * HOURS_IN_A_DAY
  );
}

export function getMinutesRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(
    (remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY) *
      HOURS_IN_A_DAY *
      MINUTES_IN_A_HOUR
  );
}

export function getSecondsRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  // use MINUTES_IN_A_HOUR 2 times since there are also 60 seconds in a minute
  return Math.floor(
    (remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY) *
      HOURS_IN_A_DAY *
      MINUTES_IN_A_HOUR *
      MINUTES_IN_A_HOUR
  );
}

export function getHoursMinusDaysRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  const getDays = getDaysRemaining(endUnixTimestamp, startUnixTimestamp);
  const hours = getDays * 24;
  return getHoursRemaining(endUnixTimestamp, startUnixTimestamp) - hours;
}

export function getMinutesMinusHoursRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  const getHours = getHoursRemaining(endUnixTimestamp, startUnixTimestamp);
  const hours = getHours * 60;
  return getMinutesRemaining(endUnixTimestamp, startUnixTimestamp) - hours;
}

export function getMarketAgeInDays(
  creationTimeTimestamp: number,
  currentTimestamp: number
): number {
  const start = moment(creationTimeTimestamp * 1000).utc();
  const daysPassed = moment(currentTimestamp * 1000).diff(start, 'days');
  return daysPassed;
}

export function getSecondsMinusMinutesRemaining(
  endUnixTimestamp: number,
  startUnixTimestamp: number
): number {
  const getMinutes = getMinutesRemaining(endUnixTimestamp, startUnixTimestamp);
  const minutes = getMinutes * 60;
  return getSecondsRemaining(endUnixTimestamp, startUnixTimestamp) - minutes;
}

export function roundTimestampToPastDayMidnight(unixTimestamp: number): number {
  const actual = moment(unixTimestamp)
    .utc()
    .startOf('day');
  return actual.unix();
}

export function getOneWeekInFutureTimestamp(currentUnixTimestamp) {
  return moment.unix(currentUnixTimestamp).add(1, 'week').unix();
}

export function getFullDaysBetween(
  startUnixTimestamp: number,
  endUnixTimestamp: number,
): string[] {
  const getDays = getDaysRemaining(endUnixTimestamp, startUnixTimestamp);
  const daysBetween: string[] = [];
  for (let i = 1; i < getDays; i++) {
    const date = moment(startUnixTimestamp * 1000).utc().startOf('day').add(i, "days");
    daysBetween.push(`${shortMonths[date.utc().month()]} ${date.utc().format("DD")}`);
  }

  return daysBetween;
}

export function getDurationBetween(timestamp1, timestamp2) {
  const timestamp1Moment = moment.unix(timestamp1);
  const timestamp2Moment = moment.unix(timestamp2);
  return moment.duration(timestamp1Moment.diff(timestamp2Moment));
}

export function calcOrderExpirationTime(endTime: number, currentTime: number) {
  // one week in the future if market endTime has already passed
  if (endTime < currentTime)
    return moment
      .unix(currentTime)
      .add(DAYS_AFTER_END_TIME_ORDER_EXPIRATION, 'days')
      .unix();
  return endTime;
}

export enum EXPIRATION_DATE_OPTIONS {
  DAYS = 'day',
  CUSTOM = '1',
  HOURS = 'hours',
  MINUTES = 'minutes',
}

export interface TimeRemaining {
  time: number;
  unit: EXPIRATION_DATE_OPTIONS;
}

export function calcOrderExpirationTimeRemaining(
  endTime: number,
  currentTime: number
): TimeRemaining {
  const fallback = { time: DAYS_AFTER_END_TIME_ORDER_EXPIRATION, unit: EXPIRATION_DATE_OPTIONS.DAYS};
  if (endTime < currentTime) return fallback;
  let remaining = getDaysRemaining(endTime, currentTime);
  if (remaining > 0) return { time: remaining, unit: EXPIRATION_DATE_OPTIONS.DAYS};
  remaining = getHoursRemaining(endTime, currentTime);
  if (remaining > 0) return {time: remaining, unit: EXPIRATION_DATE_OPTIONS.HOURS}
  remaining = getMinutesRemaining(endTime, currentTime);
  if (remaining > 0) return {time: remaining, unit: EXPIRATION_DATE_OPTIONS.MINUTES}
  return fallback;
}
