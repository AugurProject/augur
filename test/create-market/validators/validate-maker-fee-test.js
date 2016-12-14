import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import { MAKER_FEE_MIN } from 'modules/create-market/constants/market-values-constraints';
import { formatPercent } from 'utils/format-number';
import validateMakerFee from 'modules/create-market/validators/validate-maker-fee';

describe('modules/create-market/validators/validate-maker-fee.js', () => {
	let makerFee;
	let takerFee;
	let out;

	beforeEach(() => {
		makerFee = null;
		takerFee = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please specify a maker fee %';

		assert.deepEqual(validateMakerFee(makerFee, takerFee), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		makerFee = 'test';

		out = 'Maker fee must be a number';

		assert.deepEqual(validateMakerFee(makerFee, takerFee), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		makerFee = MAKER_FEE_MIN - 0.1;

		out = `Maker fee must be between ${formatPercent(MAKER_FEE_MIN, true).full} and ${formatPercent(takerFee / 2, true).full}`;

		assert.deepEqual(validateMakerFee(makerFee, takerFee), out, 'less than lower bound value state was not validated correctly');

		makerFee = (takerFee / 2) + 0.1;

		assert.deepEqual(validateMakerFee(makerFee, takerFee), out, 'greater than upper bound value state was not validated correctly');
	});
});
