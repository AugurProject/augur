import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { augur, abi, constants } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';
import * as mocks from 'test/mockStore';
import { tradeTestState } from 'test/trade/constants';

describe('modules/trade/actions/helpers/short-sell.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	const store = mockStore(testState);
	const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };
	sinon.stub(mockAugur.augur, 'short_sell', (args) => {
		const { onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
		onTradeHash('tradeHash1');
		onCommitSent({ hash: 'tradeHash1', callReturn: '1' });
		if (mockAugur.augur.short_sell.callCount !== 3) {
			onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
			onNextBlock({ hash: 'tradeHash1', callReturn: '1' });
			onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
		}
		switch (mockAugur.augur.short_sell.callCount) {
			case 2:
				onTradeFailed({ error: 'error', message: 'error message' });
				break;
			case 3:
				onCommitFailed({ error: 'error', message: 'error message' });
				break;
			case 4:
				onTradeSuccess({
					sharesBought: ZERO,
					cashFromTrade: abi.bignum('10'),
					matchedShares: abi.bignum('10'),
					unmatchedShares: abi.bignum('40'),
					unmatchedCash: ZERO,
					tradingFees: abi.bignum('0.01'),
					gasFees: abi.bignum('0.01450404'),
					hash: 'testhash',
					timestamp: 1500000000
				});
				break;
			case 5:
				onTradeSuccess({
					sharesBought: ZERO,
					cashFromTrade: abi.bignum('15'),
					matchedShares: abi.bignum('15'),
					unmatchedShares: abi.bignum('25'),
					unmatchedCash: ZERO,
					tradingFees: abi.bignum('0.01'),
					gasFees: abi.bignum('0.01450404'),
					hash: 'testhash',
					timestamp: 1500000000
				});
				break;
			case 6:
				onTradeSuccess({
					sharesBought: ZERO,
					cashFromTrade: abi.bignum('25'),
					matchedShares: abi.bignum('25'),
					unmatchedShares: abi.bignum('0'),
					unmatchedCash: ZERO,
					tradingFees: abi.bignum('0.01'),
					gasFees: abi.bignum('0.01450404'),
					hash: 'testhash',
					timestamp: 1500000000
				});
				break;
			default:
				onTradeSuccess({ sharesBought: ZERO, cashFromTrade: abi.bignum('10.00'), unmatchedShares: ZERO, unmatchedCash: ZERO, tradingFees: abi.bignum('0.01'), gasFees: abi.bignum('0.01450404'), hash: 'testhash', timestamp: 1500000000 });
				break;
		}
	});

	const mockCB = sinon.stub();

  const helper = proxyquire('../../../../src/modules/trade/actions/helpers/short-sell.js', {
    '../../../../services/augurjs': mockAugur,
  });

	beforeEach(() => {
		mockCB.reset();
	});

	it('should handle a short sell with a successful trade', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '10', '0.02', 0, 'taker1', () => [3, 4], mockCB));
		assert(mockCB.calledWithExactly(null, {
			remainingShares: ZERO,
			filledShares: ZERO,
			filledEth: abi.bignum('10'),
			tradingFees: abi.bignum('0.01'),
			gasFees: abi.bignum('0.02900808')
		}), `Didn't produce the expected object passed back to callback`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
	});

	it('should handle a short sell with a failed trade', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '10', '0.02', 0, 'taker1', () => [3, 4], mockCB));
		assert(mockCB.calledWithExactly({ error: 'error', message: 'error message' }), `Didn't call cb with an error status`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
	});

	it('should handle a short sell with a commit failure', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '10', '0.02', 0, 'taker1', () => [3, 4], mockCB));
		assert(mockCB.calledWithExactly({ error: 'error', message: 'error message' }), `Didn't call cb with an error status`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
	});

	it('should handle null numShares', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', null, '0.02', 0, 'taker1', () => [3, 4], mockCB));
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(0),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
	});

	it('should handle undefined numShares', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', undefined, '0.02', 0, 'taker1', () => [3, 4], mockCB));
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(0),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
	});

	it('should handle negative numShares', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '-50', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum('-50'),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
	});

	it('should handle an empty array of tradeIDs', () => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '10', '0.02', 0, 'taker1', () => [], mockCB));
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(10),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
	});

	it('should preform the correct calculations for a short_sell requiring multiple tradeIDs', (done) => {
		// marketID, outcomeID, numShares, tradingFees, tradeGroupID, takerAddress, getTradeIDs, cb
		store.dispatch(helper.shortSell('testBinaryMarketID', '2', '50', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], (...args) => {
			// assert no error
      assert(args[0] === null, `the error object sent to cb is not null as expected`);
			// assert that the "res" object we get back has the expected calcs
			assert(args[1].remainingShares.eq(ZERO), `remainingShares value is incorrect`);
			assert(args[1].filledShares.eq(abi.bignum('50')), `filledShares value is incorrect`);
			assert(args[1].filledEth.eq(abi.bignum('50')), `filledEth value is incorrect`);
			assert(args[1].tradingFees.eq(abi.bignum('0.03')), `tradingFees value is incorrect`);
			assert(args[1].gasFees.eq(abi.bignum('0.08702424')), `gasFees value is incorrect`);
			done();
		}));
	});
});
