import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations';

// This helper method is very specific in scope
// It takes in the formatted shares in string format and returns a string denominated as specified
function setShareDenomination(value, denomination) {
	if (value == null) {
		return value;
	}

	switch (denomination) {
		case (MICRO_SHARE):
			return formatValue(value, 4);
		case (MILLI_SHARE):
			return formatValue(value, 1);
		default:
		case (SHARE):
			return value;
	}
}

function formatValue(value, amount) { // BIG assumption here re: amount is that the formatted value is always displayed out to hundreths
	const valueArray = value.split('');

	// remove dot
	const dotIndex = valueArray.indexOf('.');
	valueArray.splice(dotIndex, 1);

	// Strip leading 0's
	let firstPositiveValue = 0;
	valueArray.some((value, i) => {
		if (parseInt(value, 10)) {
			firstPositiveValue = i;
			return true;
		}

		return false;
	});
	if (firstPositiveValue) {
		valueArray.splice(0, firstPositiveValue);
	}

	// Append 0's
	for (let i = 0; i < amount; i++) {
		valueArray.push('0');
	}

	return valueArray.join(''); // return joined string
}

export default setShareDenomination;
