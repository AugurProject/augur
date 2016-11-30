function emptyNumber(denomination) {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		roundedValue: 0,
		rounded: '-',
		minimized: '-',
		full: '-',
		denomination: denomination || ''
	};
}

export default emptyNumber;
