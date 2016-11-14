import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../../mockStore';
import { augur, abi, constants } from '../../../../src/services/augurjs';
import { tradeTestState, tradeConstOrderBooks } from '../../constants';
import { ZERO } from '../../../../src/modules/trade/constants/numbers';

describe('modules/trade/actions/helpers/trade.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.orderBooks = tradeConstOrderBooks;
	const store = mockStore(testState);
	const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };
	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb();
		return { type: 'LOAD_BIDS_ASKS' };
	});

	const mockCBStatus = sinon.stub();
	const mockCB = sinon.stub();

	describe('Buy Trade Tests', () => {
		sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
			console.log('getParticipantSharesPurchasedcc:', mockAugur.augur.getParticipantSharesPurchased.callCount);
			switch (mockAugur.augur.getParticipantSharesPurchased.callCount) {
			case 0:
				cb('5');
				break;
			case 1:
				cb('5');
				break;
			case 9:
				cb('0');
				break;
			case 10:
				cb('20');
				break;
			case 11:
				cb('80');
				break;
			default:
				cb('10');
				break;
			}
			return;
		});

		sinon.stub(mockAugur.augur, 'getCashBalance', (takerAddress, cb) => {
			console.log('getCashBalance cc:', mockAugur.augur.getCashBalance.callCount);
			switch (mockAugur.augur.getCashBalance.callCount) {
			case 10:
				cb('9960.0');
				break;
			case 11:
			case 12:
				cb('9800.0');
				break;
			default:
				cb('10000.0');
				break;
			}
			return;
		});

		sinon.stub(mockAugur.augur, 'trade', (args) => {
			// if buying numShares must be 0, if selling totalEthWithFee must be 0
			const { max_value, max_amount, trade_ids, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
			onTradeHash('tradeHash1');
			onCommitSent({ txHash: 'tradeHash1', callReturn: '1' });
			console.log('trade cc:', mockAugur.augur.trade.callCount);
			switch (mockAugur.augur.trade.callCount) {
			case 4:
				onCommitFailed({ error: 'commit failed error', message: 'commit failed error message' });
				break;
			case 5:
				onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
				onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
				onTradeFailed({ error: 'trade failed error', message: 'trade failed error message' });
				break;
			case 6:
				onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
				onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
				onTradeSuccess({ sharesBought: '20', cashFromTrade: '0', unmatchedShares: '80', unmatchedCash: '160', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
				break;
			case 7:
				onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
				onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
				onTradeSuccess({ sharesBought: '80', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
				break;
			default:
				onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
				onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
				onTradeSuccess({ sharesBought: '10', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
				break;
			}
			return;
		});

		const helper = proxyquire('../../../../src/modules/trade/actions/helpers/trade.js', {
			'../../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
			'../../../../services/augurjs': mockAugur
		});

		beforeEach(() => {
			store.clearActions();
			mockCB.reset();
			mockCBStatus.reset();
		});

		it('should help with a buy trade', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, dispatch, cbStatus, cb
			helper.trade('testBinaryMarketID', '2', '0', '20.01', '0xtaker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCBStatus.calledWith({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't called cbStatus with a filling status`);
			assert(mockCBStatus.calledWith({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.01'),
				gasFees: abi.bignum('0.02900808'),
				filledShares: abi.bignum('10'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('0'),
				remainingEth: abi.bignum('0')
			}), `Didn't call cbStatus with a filled status`);

			assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
			assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
			assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' } ], `Didn't dispatch a load_bids_asks action as expected`);
		});

		it('should handle a buy trade with js numbers sent in to trade helper', () => {
			helper.trade('testBinaryMarketID', 2, 0, 10.01, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);
			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCBStatus.calledWith({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't called cbStatus with a filling status`);
			assert(mockCBStatus.calledWith({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.01'),
				gasFees: abi.bignum('0.02900808'),
				filledShares: abi.bignum('10'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('0'),
				remainingEth: abi.bignum('0')
			}), `Didn't call cbStatus with a filled status`);

			assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
			assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
			assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }], `Didn't dispatch a load_bids_asks action as expected`);
		});

		it('should handle a buy trade with bignums sent in to trade helper', () => {
			helper.trade('testBinaryMarketID', '2', abi.bignum('0'), abi.bignum('10.01'), 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);
			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCBStatus.calledWith({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't called cbStatus with a filling status`);
			assert(mockCBStatus.calledWith({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.01'),
				gasFees: abi.bignum('0.02900808'),
				filledShares: abi.bignum('10'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('0'),
				remainingEth: abi.bignum('0')
			}), `Didn't call cbStatus with a filled status`);

			assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
			assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
			assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }], `Didn't dispatch a load_bids_asks action as expected`);
		});

		it('should not call augur.trade on a buy trade when no tradeIDs are returned', () => {
			helper.trade('testBinaryMarketID', '2', '0', '10.01', 'taker1', () => [], store.dispatch, mockCBStatus, mockCB);
			assert(mockCB.calledWithExactly(null, {
			  remainingEth: abi.bignum("10.01"),
			  remainingShares: abi.bignum("0"),
			  filledShares: abi.bignum("0"),
			  filledEth: abi.bignum("0"),
			  tradingFees: abi.bignum("0"),
			  gasFees: abi.bignum("0")
			}), `Didn't cancel the trade and return the trade object.`);

			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it('should not call trade when given a negative remainingEth input', () => {
			helper.trade('testBinaryMarketID', '2', '0', '-10.01', 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCB.calledWithExactly(null, {
			  remainingEth: abi.bignum("-10.01"),
			  remainingShares: abi.bignum("0"),
			  filledShares: abi.bignum("0"),
			  filledEth: abi.bignum("0"),
			  tradingFees: abi.bignum("0"),
			  gasFees: abi.bignum("0")
			}), `Didn't cancel the trade and return the expected trade object.`);

			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it('should not call trade when given 0 as an input for both shares and remainingEth', () => {
			helper.trade('testBinaryMarketID', '2', '0', '0', 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCB.calledWithExactly(null, {
			  remainingEth: abi.bignum("0"),
			  remainingShares: abi.bignum("0"),
			  filledShares: abi.bignum("0"),
			  filledEth: abi.bignum("0"),
			  tradingFees: abi.bignum("0"),
			  gasFees: abi.bignum("0")
			}), `Didn't cancel the trade and return the expected trade object.`);

			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it('Should handle a failed commit', () => {
			helper.trade('testBinaryMarketID', '2', '0', '20.01', '0xtaker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCB.calledWithExactly({ error: 'commit failed error', message: 'commit failed error message' }), `Didn't return the expected error object for a failed commit`);
			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
			assert(mockCBStatus.calledTwice, `the Status callback wasn't called 2 times as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it('Should handle a failed trade', () => {
			helper.trade('testBinaryMarketID', '2', '0', '20.01', '0xtaker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCBStatus.calledWith({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			assert(mockCBStatus.callCount === 4, `Didn't call the status callback 4 times as expected`);

			assert(mockCB.calledWithExactly({ error: 'trade failed error', message: 'trade failed error message' }), `Didn't return the expected error object for a failed trade`);
			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it('should handle null inputs gracefully.', () => {
			helper.trade('testBinaryMarketID', '2', null, null, '0xtaker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCB.calledWithExactly(null, {
			  remainingEth: abi.bignum('0'),
			  remainingShares: abi.bignum('0'),
			  filledShares: abi.bignum('0'),
			  filledEth: abi.bignum('0'),
			  tradingFees: abi.bignum('0'),
			  gasFees: abi.bignum('0')
			}), `Didn't return the expected error object for a failed trade`);
			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
		});

		it('should be able to handle a large amount of trade ids (100)', () => {
			const tradeIDs = [];
			for (let i = 1; i <= 100; i++) {
				let order = {
					id: 'orderID' + i,
					price: (Math.random() * (.8 - .2) + .2) + '',
					numShares: (Math.random() * (100 - 5) + 5) + '',
					outcome: '2',
					owner: 'owner' + i
				};
				tradeIDs.push('orderID' + i);
			}
			helper.trade('testBinaryMarketID', '2', '0', '200.02', '0xtaker1', () => tradeIDs, store.dispatch, mockCBStatus, mockCB);

			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			// first commit success data check
			assert(mockCBStatus.calledWithExactly({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			// second commit success data check, gas fees should increase
			assert(mockCBStatus.calledWithExactly({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.04351212')
			}), `Didn't send the right details`);
			assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't called cbStatus with a filling status`);
			// first succesfully filled trade, should fill 20 shares at 40 total eth cost
			assert(mockCBStatus.calledWithExactly({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.01'),
				gasFees: abi.bignum('0.02900808'),
				filledShares: abi.bignum('20'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('80'),
				remainingEth: abi.bignum('160')
			}), `Didn't call cbStatus with a filled status`);
			// 2nd successfully filled trade, should fill 80 shares at 160 total eth cost
			assert(mockCBStatus.calledWithExactly({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.02'),
				gasFees: abi.bignum('0.05801616'),
				filledShares: abi.bignum('100'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('0'),
				remainingEth: abi.bignum('0')
			}), `Didn't call cbStatus with a filled status`);

			assert.deepEqual(mockCBStatus.callCount, 10, `Didn't call status callback 10 times as expected`);
			assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
			assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }, { type: 'LOAD_BIDS_ASKS' } ], `Didn't dispatch a load_bids_asks action twice as expected`);
		});
	});

	describe('Sell Trade Tests', () => {
		const mockAugurSell = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };

		sinon.stub(mockAugurSell.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
			console.log('getParticipantSharesPurchasedcc:', mockAugurSell.augur.getParticipantSharesPurchased.callCount);
			switch (mockAugurSell.augur.getParticipantSharesPurchased.callCount) {
			default:
				cb('10');
				break;
			}
			return;
		});

		sinon.stub(mockAugurSell.augur, 'getCashBalance', (takerAddress, cb) => {
			console.log('getCashBalance cc:', mockAugur.augur.getCashBalance.callCount);
			switch (mockAugurSell.augur.getCashBalance.callCount) {
			default:
				cb('10000.0');
				break;
			}
			return;
		});

		sinon.stub(mockAugurSell.augur, 'trade', (args) => {
			// if buying numShares must be 0, if selling totalEthWithFee must be 0
			const { max_value, max_amount, trade_ids, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
			onTradeHash('tradeHash1');
			onCommitSent({ txHash: 'tradeHash1', callReturn: '1' });
			console.log('trade cc:', mockAugurSell.augur.trade.callCount);
			switch (mockAugurSell.augur.trade.callCount) {
			// case 4:
			// 	onCommitFailed({ error: 'commit failed error', message: 'commit failed error message' });
			// 	break;
			// case 5:
			// 	onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
			// 	onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
			// 	onTradeFailed({ error: 'trade failed error', message: 'trade failed error message' });
			// 	break;
			default:
				onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
				onTradeSent({ txHash: 'tradeHash1', callReturn: '1' });
				onTradeSuccess({ sharesBought: '10', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
				break;
			}
			return;
			// onCommitFailed({ error: 'error', message: 'error message' });
			// onNextBlock({ txHash: 'tradeHash1', callReturn: '1' });
			// onTradeFailed({ error: 'error', message: 'error message' });
		});

		const helper = proxyquire('../../../../src/modules/trade/actions/helpers/trade.js', {
			'../../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
			'../../../../services/augurjs': mockAugurSell
		});

		beforeEach(() => {
			store.clearActions();
			mockCB.reset();
			mockCBStatus.reset();
		});

		it('should help with a sell trade', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, dispatch, cbStatus, cb
			helper.trade('testBinaryMarketID', '2', '10', '0', '0xtaker1', () => ['orderID1', 'orderID2', 'orderID3'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCBStatus.calledWithExactly({ status: 'submitting' }), `Didn't call cbStatus with a submitting status`);
			assert(mockCBStatus.calledWithExactly({ status: 'committing' }), `Didn't call cbStatus with a committing status`);
			assert(mockCBStatus.calledWith({
				status: 'sending',
				hash: 'testhash',
				timestamp: 1500000000,
				gasFees: abi.bignum('0.01450404')
			}), `Didn't send the right details`);
			assert(mockCBStatus.calledWithExactly({ status: 'filling' }), `Didn't called cbStatus with a filling status`);
			assert(mockCBStatus.calledWith({
				status: 'filled',
				hash: 'testhash',
				timestamp: 1500000000,
				tradingFees: abi.bignum('0.01'),
				gasFees: abi.bignum('0.02900808'),
				filledShares: abi.bignum('10'),
				filledEth: abi.bignum('0'),
				remainingShares: abi.bignum('0'),
				remainingEth: abi.bignum('0')
			}), `Didn't call cbStatus with a filled status`);

			assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
			assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
			assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }], `Didn't dispatch a load_bids_asks action as expected`);
		});

		it('should not call trade when given a negative numShares input', () => {
			helper.trade('testBinaryMarketID', '2', '-10', '0', 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], store.dispatch, mockCBStatus, mockCB);

			assert(mockCB.calledWithExactly(null, {
			  remainingEth: abi.bignum("0"),
			  remainingShares: abi.bignum("-10"),
			  filledShares: abi.bignum("0"),
			  filledEth: abi.bignum("0"),
			  tradingFees: abi.bignum("0"),
			  gasFees: abi.bignum("0")
			}), `Didn't cancel the trade and return the expected trade object.`);

			assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);

			assert.deepEqual(store.getActions(), [], `Dispatched actions that shouldn't have dispatched.`);
		});

		it.skip('should handle a trade that sends in both numShares and remainingEth', () => {
			// not sure how this should be handled yet...
			helper.trade('testBinaryMarketID', '2', '10', '20.02', 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], store.dispatch, mockCBStatus, mockCB);

			console.log(mockCBStatus.callCount);
			console.log(mockCB.callCount);

			console.log(store.getActions());
		});
	});
});
