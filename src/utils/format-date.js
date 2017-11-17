const months = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
]

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
    formattedLocal: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(':')} ${localAMPM} (UTC ${localOffset})`, // local time
    formattedLocalShort: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (UTC ${localOffset})`, // local time
    full: date.toUTCString(),
    timestamp: date.getTime()
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
