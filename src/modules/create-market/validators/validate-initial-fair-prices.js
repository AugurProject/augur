import { SCALAR } from '../../markets/constants/market-types';

export default function validateInitialFairPrices(type, initialFairPrices, width, halfWidth, scalarMin, scalarMax) {
	// -- Constraints --
	// 	Binary + Categorical:
	//		min: priceWidth / 2
	//  	max: 1 - (priceWidth / 2)
	// 	Scalar:
	// 		min: scalarMin + (priceWidth / 2)
	// 		max: scalarMax - (priceWidth / 2)

	const max = type === SCALAR ? parseFloat(scalarMax) - halfWidth : 1 - halfWidth;
	const min = type === SCALAR ? parseFloat(scalarMin) + halfWidth : halfWidth;
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

	if (!!Object.keys(fairPriceErrors).length) {
		return fairPriceErrors;
	}
}
