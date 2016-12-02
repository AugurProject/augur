import { describe, it, before, beforeEach } from 'mocha';
import { assert } from 'chai';
import {
    INITIAL_LIQUIDITY_DEFAULT,
    STARTING_QUANTITY_DEFAULT,
    BEST_STARTING_QUANTITY_DEFAULT,
    PRICE_WIDTH_DEFAULT,
    INITIAL_LIQUIDITY_MIN
} from '../../../src/modules/create-market/constants/market-values-constraints';
import { BINARY, CATEGORICAL, SCALAR } from '../../../src/modules/markets/constants/market-types';
import { formatEther } from '../../../src/utils/format-number';
import validateInitialLiquidity from '../../../src/modules/create-market/validators/validate-initial-liquidity';

describe('modules/create-market/validators/validate-initial-liquidity.js', () => {
	let obj;
	let out;
	const types = [BINARY, CATEGORICAL, SCALAR];

	before(() => {
		obj = {
			initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
			startingQuantity: STARTING_QUANTITY_DEFAULT,
			bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
			halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
			scalarSmallNum: 10,
			scalarBigNum: 100
		};
	});

	beforeEach(() => {
		out = null;
	});

	types.forEach((type) => {
		it(`should validate a null or undefined state for ${type} market`, () => {
			obj.initialLiquidity = null;

			out = 'Please provide some initial liquidity';

			assert.deepEqual(callValidateInitialLiquidity(type, obj), out, 'null or undefined state was not validated correctly');
		});

		it(`should validate NaN for ${type} market`, () => {
			obj.initialLiquidity = 'test';

			out = 'Initial liquidity must be numeric';

			assert.deepEqual(callValidateInitialLiquidity(type, obj), out, 'NaN value state was not validated correctly');
		});

		it(`should validate priceDepth bounds for ${type} market`, () => {
			obj.initialLiquidity = 1;

			out = 'Insufficient liquidity based on advanced parameters';

			assert.deepEqual(callValidateInitialLiquidity(type, obj), out, 'priceDepth value state was not validated correclty');
		});

		it(`should validate bounds for ${type} market`, () => {
			obj.initialLiquidity = INITIAL_LIQUIDITY_MIN - 0.1;

			out = `Initial liquidity must be at least ${formatEther(INITIAL_LIQUIDITY_MIN).full}`;

			assert.deepEqual(callValidateInitialLiquidity(type, obj), out, 'less than lower bound value state was not validated correctly');
		});
	});

	function callValidateInitialLiquidity(type, obj) {
		return validateInitialLiquidity(type, obj.initialLiquidity, obj.startingQuantity, obj.bestStartingQuantity, obj.halfPriceWidth, obj.scalarBigNum, obj.scalarSmallNum);
	}
});
