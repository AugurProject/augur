function makeDate(d) {
	const months = [
		'Jan', 'Feb', 'Mar',
		'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep',
		'Oct', 'Nov', 'Dec'
	];
	const date = (d instanceof Date) ? d : new Date(0);
	return {
		value: date,
		formatted: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
		full: d.toISOString()
	};
}

export default makeDate;
