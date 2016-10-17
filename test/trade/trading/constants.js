import { assert } from 'chai';
export { BINARY, SCALAR, CATEGORICAL } from '../../../src/modules/markets/constants/market-types';
export { BUY, SELL } from '../../../src/modules/trade/constants/types';
export { BID, ASK } from '../../../src/modules/bids-asks/constants/bids-asks-types';

export const tradeShapeAssertion = (tradeDetails) => {
	assert.isDefined(tradeDetails.side, `tradeDetails.side isn't defined`);
	assert.isString(tradeDetails.side, `tradeDetails.side isn't a string`);
	assert.isDefined(tradeDetails.numShares, `tradeDetails.numShares isn't defined`);
	assert.isString(tradeDetails.numShares, `tradeDetails.numShares isn't a number`);
	assert.isDefined(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't defined`);
	assert.isString(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't a number`);
	assert.isDefined(tradeDetails.totalFee, `tradeDetails.totalFee isn't defined`);
	assert.isString(tradeDetails.totalFee, `tradeDetails.totalFee isn't a string`);
	assert.isDefined(tradeDetails.totalCost, `tradeDetails.totalCost isn't defined`);
	assert.isString(tradeDetails.totalCost, `tradeDetails.totalCost isn't a string`);
	assert.isDefined(tradeDetails.tradingFeesEth, `tradeDetails.tradingFeesEth isn't defined`);
	assert.isString(tradeDetails.tradingFeesEth, `tradeDetails.tradingFeesEth isn't a string`);
	assert.isDefined(tradeDetails.gasFeesRealEth, `tradeDetails.gasFeesRealEth isn't defined`);
	assert.isString(tradeDetails.gasFeesRealEth, `tradeDetails.gasFeesRealEth isn't a string`);
	assert.isDefined(tradeDetails.feePercent, `tradeDetails.feePercent isn't defined`);
	assert.isString(tradeDetails.feePercent, `tradeDetails.feePercent isn't a string`);

	assert.isDefined(tradeDetails.tradeActions, `tradeDetails.tradeActions isn't defined`);
	assert.isArray(tradeDetails.tradeActions, `tradeDetails.tradeActions isn't an array`);
	const action = tradeDetails.tradeActions[0];
	assert.isDefined(action, `tradeDetails.tradeActions[0] isn't defined`);
	assert.isObject(action, `tradeDetails.tradeActions[0] isn't an object`);

	assert.isDefined(action.action, `tradeDetails.tradeActions[0].action isn't defined`);
	assert.isString(action.action, `tradeDetails.tradeActions[0].action isn't a string`);

	assert.isDefined(action.shares, `tradeDetails.tradeActions[0].shares isn't defined`);
	assert.isString(action.shares, `tradeDetails.tradeActions[0].shares isn't a string`);

	assert.isDefined(action.gasEth, `tradeDetails.tradeActions[0].gasEth isn't defined`);
	assert.isString(action.gasEth, `tradeDetails.tradeActions[0].gasEth isn't a string`);

	assert.isDefined(action.feeEth, `tradeDetails.tradeActions[0].feeEth isn't defined`);
	assert.isString(action.feeEth, `tradeDetails.tradeActions[0].feeEth isn't a string`);

	assert.isDefined(action.feePercent, `tradeDetails.tradeActions[0].feePercent isn't defined`);
	assert.isString(action.feePercent, `tradeDetails.tradeActions[0].feePercent isn't a string`);

	assert.isDefined(action.costEth, `tradeDetails.tradeActions[0].costEth isn't defined`);
	assert.isString(action.costEth, `tradeDetails.tradeActions[0].costEth isn't a string`);

	assert.isDefined(action.avgPrice, `tradeDetails.tradeActions[0].avgPrice isn't defined`);
	assert.isString(action.avgPrice, `tradeDetails.tradeActions[0].avgPrice isn't a string`);

	assert.isDefined(action.noFeePrice, `tradeDetails.tradeActions[0].noFeePrice isn't defined`);
	assert.isString(action.noFeePrice, `tradeDetails.tradeActions[0].noFeePrice isn't a string`);
};
