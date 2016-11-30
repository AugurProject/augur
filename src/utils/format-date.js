const months = [
	'Jan', 'Feb', 'Mar',
	'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep',
	'Oct', 'Nov', 'Dec'
];

export function formatDate(d) {
	const date = (d instanceof Date) ? d : new Date(0);
	const time = [d.getUTCHours(), d.getUTCMinutes()];
	const ampm = (time[0] < 12) ? 'AM' : 'PM';
	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
	time[0] = time[0] || 12;
	if (time[1] < 10) time[1] = '0' + time[1];
	return {
		value: date,
		formatted: `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} ${time.join(':')} ${ampm}`,
		full: d.toUTCString(),
		timestamp: d.getTime()
	};
}
