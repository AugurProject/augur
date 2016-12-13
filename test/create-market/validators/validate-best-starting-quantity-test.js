import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import { BEST_STARTING_QUANTITY_MIN } from 'modules/create-market/constants/market-values-constraints';
import { formatShares } from 'utils/format-number';
import validateBestStartingQuantity from 'modules/create-market/validators/validate-best-starting-quantity';

describe('modules/create-market/validators/validate-best-starting-quantity.js', () => {
	let bestStartingQuantity;
	let out;

	beforeEach(() => {
		bestStartingQuantity = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please provide a best starting quantity';

		assert.deepEqual(validateBestStartingQuantity(bestStartingQuantity), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		bestStartingQuantity = 'test';

		out = 'Best starting quantity must be numeric';

		assert.deepEqual(validateBestStartingQuantity(bestStartingQuantity), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		bestStartingQuantity = BEST_STARTING_QUANTITY_MIN - 0.01;

		out = `Starting quantity must be at least ${formatShares(BEST_STARTING_QUANTITY_MIN).full}`;

		assert.deepEqual(validateBestStartingQuantity(bestStartingQuantity), out, 'less than lower bound value state was not validated correctly');
	});
});
