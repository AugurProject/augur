import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import { STARTING_QUANTITY_MIN } from '../../../src/modules/create-market/constants/market-values-constraints';
import { formatShares } from '../../../src/utils/format-number';
import validateStartingQuantity from '../../../src/modules/create-market/validators/validate-starting-quantity';

describe('modules/create-market/validators/validate-starting-quantity.js', () => {
	let startingQuantity;
	let out;

	beforeEach(() => {
		startingQuantity = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please provide a starting quantity';

		assert.deepEqual(validateStartingQuantity(startingQuantity), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		startingQuantity = 'test';

		out = 'Starting quantity must be numeric';

		assert.deepEqual(validateStartingQuantity(startingQuantity), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		startingQuantity = STARTING_QUANTITY_MIN - 0.01;

		out = `Starting quantity must be at least ${formatShares(STARTING_QUANTITY_MIN).full}`;

		assert.deepEqual(validateStartingQuantity(startingQuantity), out, 'less than lower bound value state was not validated correctly');
	});
});
