export default function (millis) {
  let timePassed
  if (millis > (60 * 60 * 1000)) {
    timePassed = 'more than hour ago'
  } else if (millis === (60 * 60 * 1000)) {
    timePassed = 'hour ago'
  } else if (millis >= 1000) {
    const mins = Math.floor(millis / (60 * 1000))
    const secs = Math.floor((millis - (mins * 60 * 1000)) / 1000)
    timePassed = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs} ago`
  } else {
    timePassed = 'less than a second ago'
  }
  return timePassed
}
