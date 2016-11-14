import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations';
import addCommas from 'utils/add-commas-to-number';

// This helper method is very specific in scope
// It takes in the formatted shares in string format and returns a string denominated as specified
// The mutation of the shares is done this way so no actual re-calculation is done to the underlying
// values, just string manipulation for presentation
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

// The value is assumed to *always* be in 'SHARES' denomination
function formatValue(value, amount) {
	let valueArray = value.split('');

	// remove dot + determine 0 pad amount
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

	// Strip Commas (added back in at the end)
	valueArray.forEach((value, i) => {
		if (value === ',') {
			valueArray.splice(i, 1);
		}
	});

	// Handle postFixed denominations (part of the format-number method)
	valueArray = handlePostfixedUnit(valueArray, zeroPadAmount);

	return addCommas(valueArray.join('')); // return joined string w/ comma separating thousands
}

function handlePostfixedUnit(valueArray, zeroPadAmount) {
	const step = zeroPadAmount < 4;
	const gtTrillion = '> 1T'.split('');
	let newValueArray = valueArray;

	switch (valueArray[newValueArray.length - 1]) {
		// Handle existing > 10000 values
		case ('K'): {
			newValueArray[newValueArray.length - 1] = step ? 'M' : 'B';
			return newValueArray;
		}
		case ('M'): {
			if (step) {
				newValueArray[newValueArray.length - 1] = 'B';
			} else {
				newValueArray = gtTrillion;
			}
			return newValueArray;
		}
		case ('B'):
		case ('T'): {
			newValueArray = gtTrillion;
			return newValueArray;
		}

		// Handle values that become greater than 10000
		default: {
			// Append 0's
			for (let i = 0; i < zeroPadAmount; i++) {
				newValueArray.push('0');
			}

			// Mirrors logic present in format-number
			if (newValueArray.length >= 13) {
				newValueArray = gtTrillion;
			} else if (newValueArray.length >= 11) {
				newValueArray.splice(newValueArray.length - 9);
				newValueArray.push('B');
			} else if (newValueArray.length >= 8) {
				newValueArray.splice(newValueArray.length - 6);
				newValueArray.push('M');
			} else if (newValueArray.length >= 5) {
				newValueArray.splice(newValueArray.length - 3);
				newValueArray.push('K');
			}

			return newValueArray;
		}
	}
}

export default setShareDenomination;
