/*
 *
 *
 * Author: priecint
 */

export default function (millis) {
	if (millis > (60 * 60 * 1000)) {
		return 'more than hour ago';
	} else if (millis == (60 * 60 * 1000)) {
		return 'hour ago';
	} else if (millis >= 1000) {
		const mins = Math.floor(millis / (60 * 1000));
		const secs = Math.floor((millis - (mins * 60 * 1000)) / 1000);
		return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs} ago`;
	} else {
		return 'less than a second ago';
	}
}
