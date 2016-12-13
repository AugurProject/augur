import { describe, it, before, beforeEach } from 'mocha';
import { assert } from 'chai';
import { PRICE_WIDTH_DEFAULT } from 'modules/create-market/constants/market-values-constraints';
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import validateInitialFairPrices from 'modules/create-market/validators/validate-initial-fair-prices';

describe('modules/create-market/validators/validate-initial-fair-prices.js', () => {
	let obj;
	let bounds;
	let out;
	const types = [BINARY, CATEGORICAL, SCALAR];

	before(() => {
		obj = {
			initialFairPrices: [0.5, 0.5],
			priceWidth: PRICE_WIDTH_DEFAULT,
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
			bounds = setMinMax(type);

			obj.initialFairPrices = [null, bounds.max - 0.1];

			out = { 0: 'Please provide some initial liquidity' };

			assert.deepEqual(callValidateInitialFairPrices(type, obj), out, 'null or undefined state was not validated correctly');
		});

		it(`should validate NaN for ${type} market`, () => {
			bounds = setMinMax(type);

			obj.initialFairPrices = ['test', bounds.max - 0.1];

			out = { 0: 'Initial liquidity must be numeric' };

			assert.deepEqual(callValidateInitialFairPrices(type, obj), out, 'NaN value state was not validated correctly');
		});

		it(`should validate bounds for ${type} market`, () => {
			bounds = setMinMax(type);

			obj.initialFairPrices = [bounds.min - 0.1, bounds.max - 0.1];

			out = {
				0: `Initial prices must be between ${bounds.min} - ${bounds.max} based on the price width of ${obj.priceWidth}`
			};

			assert.deepEqual(callValidateInitialFairPrices(type, obj), out, 'less than lower bound value state was not validated correctly');

			obj.initialFairPrices = [bounds.min + 0.1, bounds.max + 0.1];

			out = {
				1: `Initial prices must be between ${bounds.min} - ${bounds.max} based on the price width of ${obj.priceWidth}`
			};

			assert.deepEqual(callValidateInitialFairPrices(type, obj), out, 'great than upper bound value state was not validated correctly');
		});
	});

	function setMinMax(type) {
		return {
			max: type === SCALAR ? obj.scalarBigNum - obj.halfPriceWidth : 1 - obj.halfPriceWidth,
			min: type === SCALAR ? obj.scalarSmallNum + obj.halfPriceWidth : obj.halfPriceWidth
		};
	}

	function callValidateInitialFairPrices(type, currentObj) {
		return validateInitialFairPrices(
			type,
			currentObj.initialFairPrices,
			currentObj.priceWidth,
			currentObj.halfPriceWidth,
			currentObj.scalarSmallNum,
			currentObj.scalarBigNum);
	}
});
