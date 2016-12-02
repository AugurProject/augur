import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import { PRICE_WIDTH_MIN } from '../../../src/modules/create-market/constants/market-values-constraints';
import { formatEther } from '../../../src/utils/format-number';
import validatePriceWidth from '../../../src/modules/create-market/validators/validate-price-width';

describe('modules/create-market/validators/validate-price-width.js', () => {
	let priceWidth;
	let out;

	beforeEach(() => {
		priceWidth = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please provide a price width';

		assert.deepEqual(validatePriceWidth(priceWidth), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		priceWidth = 'test';

		out = 'Price width must be numeric';

		assert.deepEqual(validatePriceWidth(priceWidth), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		priceWidth = PRICE_WIDTH_MIN - 0.001;

		out = `Price width must be at least ${formatEther(PRICE_WIDTH_MIN).full}`;

		assert.deepEqual(validatePriceWidth(priceWidth), out, 'less than lower bound value state was not validated correctly');
	});
});
