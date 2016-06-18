import {
    assert
} from 'chai';
import { TRADING_FEE_MIN, TRADING_FEE_MAX } from '../../../src/modules/create-market/constants/market-values-constraints';
import { formatPercent } from '../../../src/utils/format-number';
import validateTradingFee from '../../../src/modules/create-market/validators/validate-trading-fee';

describe('modules/create-market/validators/validate-trading-fee.js', () => {
	let tradingFeePercent,
		out;

	beforeEach(() => {
		tradingFeePercent = null;
		out = null;
	});

	it('should validate a null or undefined state', () => {
		out = 'Please specify a trading fee %';

		assert.deepEqual(validateTradingFee(tradingFeePercent), out, 'null or undefined state was not validated correctly');
	});

	it('should validate NaN', () => {
		tradingFeePercent = 'test';

		out = 'Trading fee must be a number';

		assert.deepEqual(validateTradingFee(tradingFeePercent), out, 'NaN value state was not validated correctly');
	});

	it('should validate bounds', () => {
		tradingFeePercent = TRADING_FEE_MIN - 0.1;

		out = `Trading fee must be between ${ formatPercent(TRADING_FEE_MIN, true).full } and ${ formatPercent(TRADING_FEE_MAX, true).full }`;

		assert.deepEqual(validateTradingFee(tradingFeePercent), out, 'less than lower bound value state was not validated correctly');

		tradingFeePercent = TRADING_FEE_MAX + 0.1;

		assert.deepEqual(validateTradingFee(tradingFeePercent), out, 'greater than upper bound value state was not validated correctly');
	});
});