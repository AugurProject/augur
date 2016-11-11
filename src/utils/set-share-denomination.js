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

function formatValue(value, amount) {
	const valueArray = value.split('');

	// remove dot
	const dotIndex = valueArray.indexOf('.');
	let zeroPadAmount = amount;
	if (dotIndex !== -1) {
		valueArray.splice(dotIndex, 1);
	} else {
		zeroPadAmount += 2;
	}

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
	for (let i = 0; i < zeroPadAmount; i++) {
		valueArray.push('0');
	}

	return valueArray.join('').replace(/\B(?=(\d{3})+(?!\d))/g, ','); // return joined string w/ comma separating thousands, BIG assumption here is that we're always rounding to TWO decimal places
}

export default setShareDenomination;
