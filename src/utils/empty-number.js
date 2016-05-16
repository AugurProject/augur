export function emptyNumber(denomination) {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		rounded: '-',
		minimized: '-',
		full: '-',
		denomination: denomination || ''
	};
}