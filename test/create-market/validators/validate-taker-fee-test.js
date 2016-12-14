import { describe, it, beforeEach } from 'mocha';
import {
    assert
} from 'chai';
import { TAKER_FEE_MIN, TAKER_FEE_MAX } from 'modules/create-market/constants/market-values-constraints';
import { formatPercent } from 'utils/format-number';
import validateTakerFee from 'modules/create-market/validators/validate-taker-fee';

describe('modules/create-market/validators/validate-taker-fee.js', () => {
	let takerFee;
	let out;

	beforeEach(() => {
		takerFee = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please specify a taker fee %';

		assert.deepEqual(validateTakerFee(takerFee), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		takerFee = 'test';

		out = 'Trading fee must be a number';

		assert.deepEqual(validateTakerFee(takerFee), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		takerFee = TAKER_FEE_MIN - 0.1;

		out = `Trading fee must be between ${formatPercent(TAKER_FEE_MIN, true).full} and ${formatPercent(TAKER_FEE_MAX, true).full}`;

		assert.deepEqual(validateTakerFee(takerFee), out, 'less than lower bound value state was not validated correctly');

		takerFee = TAKER_FEE_MAX + 0.1;

		assert.deepEqual(validateTakerFee(takerFee), out, 'greater than upper bound value state was not validated correctly');
	});
});
