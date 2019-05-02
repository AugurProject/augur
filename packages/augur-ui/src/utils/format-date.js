import moment from "moment";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

export const NUMBER_OF_SECONDS_IN_A_DAY = 86400;
const HOURS_IN_A_DAY = 24;
const MINUTES_IN_A_HOUR = 60;

export function formatDate(d) {
  const date = d instanceof Date ? d : new Date(0);

  // UTC Time Formatting
  const utcTime = [date.getUTCHours(), date.getUTCMinutes()];
  const utcTimeTwelve = getTwelveHourTime(utcTime);
  const utcTimeWithSeconds = [
    ("0" + date.getUTCHours()).slice(-2),
    ("0" + date.getUTCMinutes()).slice(-2),
    ("0" + date.getUTCSeconds()).slice(-2)
  ];
  const utcAMPM = ampm(("0" + date.getUTCHours()).slice(-2));

  // Locat Time Formatting
  const localTime = [date.getHours(), date.getMinutes()];
  const localAMPM = ampm(localTime[0]);
  const localTimeTwelve = getTwelveHourTime(localTime);
  const localOffset = (date.getTimezoneOffset() / 60) * -1;
  const localOffsetFormatted =
    localOffset > 0 ? `+${localOffset}` : localOffset.toString();
  const timezone = `(${
    date.toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2]
  })`;

  return {
    value: date,
    simpleDate: `${date.getUTCDate()} ${months[date.getUTCMonth()]}`,
    formatted: `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()} ${utcTimeTwelve.join(
      ":"
    )} ${utcAMPM}`, // UTC time
    formattedShortDate: `${("0" + date.getUTCDate()).slice(-2)}${
      shortMonths[date.getUTCMonth()]
    } ${date.getUTCFullYear()}`,
    formattedShortTime: `${utcTimeWithSeconds.join(":")}`,
    formattedShort: `${shortMonths[date.getUTCMonth()]}${(
      "0" + date.getUTCDate()
    ).slice(-2)} ${date.getUTCFullYear()} ${utcTimeWithSeconds.join(":")}`,
    formattedLocal: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ":"
    )} ${localAMPM} (UTC ${localOffsetFormatted})`, // local time
    formattedLocalShortDate: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`,
    formattedLocalShort: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} (UTC ${localOffsetFormatted})`, // local time
    formattedLocalShortTime: `${
      shortMonths[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ":"
    )} ${localAMPM} (UTC ${localOffsetFormatted})`, // local time
    full: date.toUTCString(),
    timestamp: date.getTime() / 1000,
    utcLocalOffset: localOffset,
    clockTimeLocal: `${localTimeTwelve.join(
      ":"
    )} ${localAMPM} (UTC ${localOffsetFormatted})`,
    formattedSimpleData: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`,
    formattedUtcShortDate: `${
      shortMonths[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()}`,
    clockTimeUtc: `${utcTimeTwelve.join(":")} ${utcAMPM} - UTC`,
    formattedTimezone: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ":"
    )} ${localAMPM} ${timezone} (Local timezone)`,
    formattedUtc: `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()} ${utcTimeTwelve.join(
      ":"
    )} ${utcAMPM} (UTC 0)`
  };
}

function ampm(time) {
  return time < 12 ? "AM" : "PM";
}

function convertToTwelveHour(value) {
  const hour = value < 12 ? value : value - 12;
  return hour || 12;
}

function getTwelveHourTime(time) {
  time[0] = convertToTwelveHour(time[0]);
  if (time[1] < 10) time[1] = "0" + time[1];

  return time;
}

export function convertUnixToFormattedDate(integer = 0) {
  return formatDate(moment.unix(integer).toDate());
}

export function getBeginDate(
  currentAugurTimestampInMilliseconds,
  periodString
) {
  const date = moment(currentAugurTimestampInMilliseconds);
  let beginDate = date.subtract(1, "day");
  if (periodString === "week") {
    beginDate = date.subtract(7, "day");
  }
  if (periodString === "month") {
    beginDate = date.subtract(1, "month");
  }
  if (periodString === "all") {
    return null;
  }
  return beginDate.unix();
}

export function dateHasPassed(
  currentAugurTimestampInMilliseconds,
  unixTimestamp
) {
  const date = moment(currentAugurTimestampInMilliseconds).utc();
  return date.unix() > unixTimestamp;
}

export function getDaysRemaining(endUnixTimestamp, startUnixTimestamp) {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY);
}

export function getHoursRemaining(endUnixTimestamp, startUnixTimestamp) {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(
    (remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY) * HOURS_IN_A_DAY
  );
}

export function getMinutesRemaining(endUnixTimestamp, startUnixTimestamp) {
  if (!endUnixTimestamp || !startUnixTimestamp) return 0;
  if (startUnixTimestamp > endUnixTimestamp) return 0;
  const remainingTicks = endUnixTimestamp - startUnixTimestamp;
  return Math.floor(
    (remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY) *
      HOURS_IN_A_DAY *
      MINUTES_IN_A_HOUR
  );
}

export function getSecondsRemaining(endUnixTimestamp, startUnixTimestamp) {
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
  endUnixTimestamp,
  startUnixTimestamp
) {
  const getDays = getDaysRemaining(endUnixTimestamp, startUnixTimestamp);
  const hours = getDays * 24;
  return getHoursRemaining(endUnixTimestamp, startUnixTimestamp) - hours;
}

export function getMinutesMinusHoursRemaining(
  endUnixTimestamp,
  startUnixTimestamp
) {
  const getHours = getHoursRemaining(endUnixTimestamp, startUnixTimestamp);
  const hours = getHours * 60;
  return getMinutesRemaining(endUnixTimestamp, startUnixTimestamp) - hours;
}

export function getMarketAgeInDays(creationTimeTimestamp, currentTimestamp) {
  const start = moment(creationTimeTimestamp * 1000).utc();
  const daysPassed = moment(currentTimestamp * 1000).diff(start, "days");
  return daysPassed;
}

export function getSecondsMinusMinutesRemaining(
  endUnixTimestamp,
  startUnixTimestamp
) {
  const getMinutes = getMinutesRemaining(endUnixTimestamp, startUnixTimestamp);
  const minutes = getMinutes * 60;
  return getSecondsRemaining(endUnixTimestamp, startUnixTimestamp) - minutes;
}

export function roundTimestampToPastDayMidnight(unixTimestamp) {
  const actual = moment(unixTimestamp)
    .utc()
    .startOf("day");
  return actual.unix();
}
