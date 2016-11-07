import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { augur, abi, constants } from '../../../../src/services/augurjs';

describe('modules/trade/actions/helpers/short-sell.js', () => {
	proxyquire.noPreserveCache();
	const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };

	sinon.stub(mockAugur.augur, 'short_sell', (args) => {
		const { max_amount, buyer_trade_id, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
		onTradeHash('tradeHash1');
		onCommitSent({ txHash: 'tradeHash1', callReturn: '1' });
		if (mockAugur.augur.short_sell.callCount !== 3)onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
		if (mockAugur.augur.short_sell.callCount === 3) onCommitFailed({ error: 'error', message: 'error message' });
		if (mockAugur.augur.short_sell.callCount !== 3) onNextBlock({ txHash: 'tradeHash1', callReturn: '1' });
		if (mockAugur.augur.short_sell.callCount !== 3) onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
		if (mockAugur.augur.short_sell.callCount === 1) onTradeSuccess({ sharesBought: '0', cashFromTrade: '10.00', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
		if (mockAugur.augur.short_sell.callCount === 2) onTradeFailed({ error: 'error', message: 'error message' });
	});

	const mockCBStatus = sinon.stub();
	const mockCB = sinon.stub();

	const helper = proxyquire('../../../../src/modules/trade/actions/helpers/short-sell.js', {
		'../../../../services/augurjs': mockAugur
	});

	beforeEach(() => {
		mockCB.reset();
		mockCBStatus.reset();
	});

	it('should handle a short sell with a successful trade', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [3, 4], mockCBStatus, mockCB);

		assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
		assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
		assert(mockCBStatus.calledWith({
			status: 'sending',
			hash: 'testhash',
			timestamp: 1500000000,
			gasFees: abi.bignum('0.01450404')
		}), `Didn't send the right details`);
		assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't call cbStatus with a filling status`);
		assert(mockCBStatus.calledWith({
			status: 'success',
			hash: 'testhash',
			timestamp: 1500000000,
			tradingFees: abi.bignum('0.01'),
			gasFees: abi.bignum('0.02900808')
		}), `Didn't call cbStatus with a filled status`);

		assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
	});

	it('should handle a short sell with a failed trade', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [3, 4], mockCBStatus, mockCB);
		assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
		assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
		assert(mockCBStatus.calledWith({
			status: 'sending',
			hash: 'testhash',
			timestamp: 1500000000,
			gasFees: abi.bignum('0.01450404')
		}), `Didn't send the right details`);
		assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't call cbStatus with a filling status`);
		assert(mockCB.calledWithExactly({ error: 'error', message: 'error message' }), `Didn't calle cb with an error status`);


		assert.deepEqual(mockCBStatus.callCount, 4, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
	});

	it('should handle a short sell with a commit failure', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [3, 4], mockCBStatus, mockCB);

		assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
		assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
		assert(mockCB.calledWithExactly({ error: 'error', message: 'error message' }), `Didn't calle cb with an error status`);

		assert.deepEqual(mockCBStatus.callCount, 2, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
	});

	it('should handle null inputs', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', null, 'taker1', () => [3, 4], mockCBStatus, mockCB);
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(0),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
		assert(mockCBStatus.callCount === 0, `Called the status cb when it shouldn't have`);
	});

	it('should handle undefined inputs', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', undefined, 'taker1', () => [3, 4], mockCBStatus, mockCB);
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(0),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
		assert(mockCBStatus.callCount === 0, `Called the status cb when it shouldn't have`);
	});

	it('should handle an empty array of tradeIDs', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [ ], mockCBStatus, mockCB);
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum(10),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
		assert(mockCBStatus.callCount === 0, `Called the status cb when it shouldn't have`);
	});
});
