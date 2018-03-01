import moment from 'moment'

const months = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
]

const shortMonths = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sept',
  'Oct', 'Nov', 'Dec'
]

const NUMBER_OF_SECONDS_IN_A_DAY = 86400

export function formatDate(d) {
  const date = (d instanceof Date) ? d : new Date(0)

  // UTC Time Formatting
  const utcTime = [date.getUTCHours(), date.getUTCMinutes()]
  const utcAMPM = ampm(utcTime[0])
  const utcTimeTwelve = getTwelveHour(utcTime)

  // Locat Time Formatting
  const localTime = [date.getHours(), date.getMinutes()]
  const localAMPM = ampm(localTime[0])
  const localTimeTwelve = getTwelveHour(localTime)
  const localOffset = (date.getTimezoneOffset() / 60) * -1

  return {
    value: date,
    simpleDate: `${date.getUTCDate()} ${months[date.getUTCMonth()]}`,
    formatted: `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${utcTimeTwelve.join(':')} ${utcAMPM}`, // UTC time
    formattedShort: `${shortMonths[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${utcTimeTwelve.join(':')} ${utcAMPM}`, // UTC time
    formattedLocal: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(':')} ${localAMPM} (UTC ${localOffset})`, // local time
    formattedLocalShort: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (UTC ${localOffset})`, // local time
    full: date.toUTCString(),
    timestamp: date.getTime() / 1000
  }
}

function ampm(time) {
  return (time < 12 ? 'AM' : 'PM')
}

function getTwelveHour(time) {
  time[0] = (time[0] < 12) ? time[0] : time[0] - 12
  time[0] = time[0] || 12
  if (time[1] < 10) time[1] = '0' + time[1]

  return time
}

export function convertUnixToFormattedDate(integer = 0) {
  return formatDate(moment.unix(integer).toDate())
}

export function getBeginDate(periodString) {
  const date = moment()
  let beginDate = date.subtract(1, 'day')
  if (periodString === 'week') {
    beginDate = date.subtract(7, 'day')
  }
  if (periodString === 'month') {
    beginDate = date.subtract(1, 'month')
  }
  if (periodString === 'all') {
    return null
  }
  return beginDate.unix()
}

export function dateHasPassed(unixTimestamp) {
  const date = moment().utc()
  return (date.unix() >= unixTimestamp)
}

/** timestamps are always in seconds */
export function getCurrentDateTimestamp() {
  return Date.now() / 1000
}

export function getDaysRemaining(endTimestamp, startTimestamp) {
  if (!endTimestamp) return 0
  let start = startTimestamp
  if (!startTimestamp) {
    start = formatDate(new Date()).timestamp
  }
  if (start > endTimestamp) return 0
  const remainingTicks = endTimestamp - start
  return Math.floor(remainingTicks / NUMBER_OF_SECONDS_IN_A_DAY)
}
