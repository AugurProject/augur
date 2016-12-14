import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { augur, abi, constants } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';

describe('modules/trade/actions/helpers/short-sell.js', () => {
	proxyquire.noPreserveCache();
	const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };

	sinon.stub(mockAugur.augur, 'short_sell', (args) => {
		const { onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
		// console.log('mock short_sell called');
		// console.log(args);
		onTradeHash('tradeHash1');
		onCommitSent({ hash: 'tradeHash1', callReturn: '1' });

		if (mockAugur.augur.short_sell.callCount !== 3) {
			onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
			onNextBlock({ hash: 'tradeHash1', callReturn: '1' });
			onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
		}
		// console.log('short_sell callcount:', mockAugur.augur.short_sell.callCount);
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

	const mockCBStatus = sinon.stub();
	const mockCB = sinon.stub();

	const helper = proxyquire('../../../../src/modules/trade/actions/helpers/short-sell.js', {
		'../../../../services/augurjs': mockAugur,
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

		assert(mockCB.calledWithExactly(null, {
			remainingShares: ZERO,
			filledShares: ZERO,
			filledEth: abi.bignum('10'),
			tradingFees: abi.bignum('0.01'),
			gasFees: abi.bignum('0.02900808')
		}), `Didn't produce the expected object passed back to callback`);

		assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
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
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
	});

	it('should handle a short sell with a commit failure', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [3, 4], mockCBStatus, mockCB);

		assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
		assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
		assert(mockCB.calledWithExactly({ error: 'error', message: 'error message' }), `Didn't calle cb with an error status`);

		assert.deepEqual(mockCBStatus.callCount, 2, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 1 time as expected`);
	});

	it('should handle null numShares', () => {
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

	it('should handle undefined numShares', () => {
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

	it('should handle negative numShares', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '-50', 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCBStatus, mockCB);
		assert(mockCB.calledOnce, `the callback wasn't called once as expected`);
		assert(mockCB.calledWithExactly(null, {
			remainingShares: abi.bignum('-50'),
			filledShares: abi.bignum(0),
			filledEth: abi.bignum(0),
			tradingFees: abi.bignum(0),
			gasFees: abi.bignum(0)
		}), `Didn't call the callback with the expected response`);
		assert(mockCBStatus.callCount === 0, `Called the status cb when it shouldn't have`);
	});

	it('should handle an empty array of tradeIDs', () => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '10', 'taker1', () => [], mockCBStatus, mockCB);
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

	it('should preform the correct calculations for a short_sell requiring multiple tradeIDs', (done) => {
		// marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb
		helper.shortSell('testBinaryMarketID', '2', '50', 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCBStatus, (...args) => {
			// assert no error
			assert(args[0] === null, `the error object sent to cb is not null as expected`);
			// assert that the "res" object we get back has the expected calcs
			assert(args[1].remainingShares.eq(ZERO), `remainingShares value is incorrect`);
			assert(args[1].filledShares.eq(abi.bignum('50')), `filledShares value is incorrect`);
			assert(args[1].filledEth.eq(abi.bignum('50')), `filledEth value is incorrect`);
			assert(args[1].tradingFees.eq(abi.bignum('0.03')), `tradingFees value is incorrect`);
			assert(args[1].gasFees.eq(abi.bignum('0.08702424')), `gasFees value is incorrect`);

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

			assert(mockCBStatus.calledWith({
				status: 'success',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.02'),
				gasFees: abi.bignum('0.05801616')
			}), `Didn't call cbStatus with a filled status`);

			assert(mockCBStatus.calledWith({
				status: 'success',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.03'),
				gasFees: abi.bignum('0.08702424')
			}), `Didn't call cbStatus with a filled status`);

			assert(mockCBStatus.callCount === 15, `mockCBStatus wasn't called 15 times as expected`);

			done();
		});
	});
});
