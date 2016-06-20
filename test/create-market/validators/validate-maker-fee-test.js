import {
    assert
} from 'chai';
import { MAKER_FEE_MIN, MAKER_FEE_MAX } from '../../../src/modules/create-market/constants/market-values-constraints';
import { formatPercent } from '../../../src/utils/format-number';
import validateMakerFee from '../../../src/modules/create-market/validators/validate-maker-fee';

describe('modules/create-market/validators/validate-maker-fee.js', () => {
	let makerFee,
		out;

	beforeEach(() => {
		makerFee = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please specify a maker fee %';

		assert.deepEqual(validateMakerFee(makerFee), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		makerFee = 'test';

		out = 'Maker fee must be a number';

		assert.deepEqual(validateMakerFee(makerFee), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		makerFee = MAKER_FEE_MIN - 0.1;

		out = `Maker fee must be between ${ formatPercent(MAKER_FEE_MIN, true).full } and ${ formatPercent(MAKER_FEE_MAX, true).full }`;

		assert.deepEqual(validateMakerFee(makerFee), out, 'less than lower bound value state was not validated correctly');

		makerFee = MAKER_FEE_MAX + 0.1;

		assert.deepEqual(validateMakerFee(makerFee), out, 'greater than upper bound value state was not validated correctly');
	});
});