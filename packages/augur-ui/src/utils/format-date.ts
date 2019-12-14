import moment from 'moment';
import { DateFormattedObject, TimezoneDateObject } from 'modules/types';
import { createBigNumber } from './create-big-number';
import { ZERO } from 'modules/common/constants';

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
  const utcTime: Array<number> = [date.getUTCHours(), date.getUTCMinutes()];
  const utcTimeTwelve: Array<string> = getTwelveHourTime(utcTime);
  const utcTimeWithSeconds: Array<string> = [
    ('0' + date.getUTCHours()).slice(-2),
    ('0' + date.getUTCMinutes()).slice(-2),
    ('0' + date.getUTCSeconds()).slice(-2),
  ];
  const utcAMPM: string = ampm(('0' + date.getUTCHours()).slice(-2));

  // Locat Time Formatting
  const local24hrTimeWithSeconds: Array<number> = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const localAMPM: string = ampm(local24hrTimeWithSeconds[0].toString());
  const localTimeTwelve: Array<string> = getTwelveHourTime(local24hrTimeWithSeconds);
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

function getTwelveHourTime(time: Array<number>): Array<string> {
  const values: Array<string> = new Array(time.length);
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

  const endTime = moment
    .unix(timestamp)
    .utc()
    .startOf('day');

  endTime.set({
    hour: hour,
    minute: minute,
  });

  if ((meridiem === '' || meridiem === 'AM') && endTime.hours() >= 12) {
    endTime.hours(endTime.hours() - 12);
  } else if (meridiem && meridiem === 'PM' && endTime.hours() < 12) {
    endTime.hours(endTime.hours() + 12);
  }
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

export function convertUnixToFormattedDate(integer: number = 0) {
  return formatDate(moment.unix(integer).toDate());
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
): Array<string> {
  const getDays = getDaysRemaining(endUnixTimestamp, startUnixTimestamp);
  const daysBetween: Array<string> = [];
  for (let i = 1; i < getDays; i++) {
    const date = moment(startUnixTimestamp * 1000).utc().startOf('day').add(i, "days");
    daysBetween.push(`${shortMonths[date.utc().month()]} ${date.utc().format("DD")}`);
  }

  return daysBetween;
}
