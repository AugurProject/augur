const months = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
]

export function formatDate(d) {
  const date = (d instanceof Date) ? d : new Date(0)

  // UTC Time Formatting
  const utcTime = [d.getUTCHours(), d.getUTCMinutes()]
  const utcAMPM = ampm(utcTime[0])
  const utcTimeTwelve = getTwelveHour(utcTime)

  // Locat Time Formatting
  const localTime = [d.getHours(), d.getMinutes()]
  const localAMPM = ampm(localTime[0])
  const localTimeTwelve = getTwelveHour(localTime)
  const localOffset = (date.getTimezoneOffset() / 60) * -1

  return {
    value: date,
    simpleDate: `${d.getUTCDate()} ${months[d.getUTCMonth()]}`,
    formatted: `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} ${utcTimeTwelve.join(':')} ${utcAMPM}`, // UTC time
    formattedLocal: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${localTimeTwelve.join(':')} ${localAMPM} (UTC ${localOffset})`, // local time
    formattedLocalShort: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (UTC ${localOffset})`, // local time
    full: d.toUTCString(),
    timestamp: d.getTime()
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
