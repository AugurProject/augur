import { abi } from '../../../services/augurjs';
import { ONE } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';

export default function validateInitialFairPrices(type, initialFairPrices, width, halfWidth, scalarMin, scalarMax) {
	// -- Constraints --
	// 	Binary + Categorical:
	//		min: priceWidth / 2
	//  	max: 1 - (priceWidth / 2)
	// 	Scalar:
	// 		min: scalarMin + (priceWidth / 2)
	// 		max: scalarMax - (priceWidth / 2)
	let max;
	let min;
	if (isNaN(parseFloat(halfWidth)) || isNaN(parseFloat(scalarMin)) || isNaN(parseFloat(scalarMax))) {
		max = NaN;
		min = NaN;
	} else {
		max = type === SCALAR ? abi.bignum(scalarMax).minus(abi.bignum(halfWidth)).toNumber() : ONE.minus(abi.bignum(halfWidth)).toNumber();
		min = type === SCALAR ? abi.bignum(scalarMin).plus(abi.bignum(halfWidth)).toNumber() : halfWidth;
	}
	const fairPriceErrors = {};

	initialFairPrices.map((cV, i) => {
		const parsed = parseFloat(cV);

		if (!cV) {
			fairPriceErrors[`${i}`] = 'Please provide some initial liquidity';
			return null;
		}
		if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
			fairPriceErrors[`${i}`] = 'Initial liquidity must be numeric';
			return null;
		}
		if (cV < min || cV > max) {
			fairPriceErrors[`${i}`] = `Initial prices must be between ${min} - ${max} based on the price width of ${width}`;
			return null;
		}
		return null;
	});

	if (Object.keys(fairPriceErrors).length) {
		return fairPriceErrors;
	}
}
