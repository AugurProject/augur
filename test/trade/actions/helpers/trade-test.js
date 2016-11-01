import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../../mockStore';
import { augur, abi, constants } from '../../../../src/services/augurjs';
import { tradeTestState } from '../../constants';

describe('modules/trade/actions/helpers/trade.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.transactionsData = {
		'trans1': {
			data: {
				marketID: 'testBinaryMarketID',
				outcomeID: '2',
				marketType: 'binary',
				marketDescription: 'test binary market',
				outcomeName: 'YES'
			},
			feePercent: {
				value: '0.199203187250996016'
			}
		},
		'trans2': {
			data: {
				marketID: 'testCategoricalMarketID',
				outcomeID: '1',
				marketType: 'categorical',
				marketDescription: 'test categorical market',
				outcomeName: 'Democratic'
			},
			feePercent: {
				value: '0.099800399201596707'
			}
		},
		'trans3': {
			data: {
				marketID: 'testScalarMarketID',
				outcomeID: '1',
				marketType: 'scalar',
				marketDescription: 'test scalar market',
				outcomeName: ''
			},
			feePercent: {
				value: '0.95763203714451532'
			}
		}
	};
	testState.orderBooks = {
		'testBinaryMarketID': {
			buy: {
				'order1': {
					id: 1,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				},
				'order2': {
					id: 2,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				}
			},
			sell: {
				'order3': {
					id: 3,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				},
				'order4': {
					id: 4,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				}
			}
		},
		'testCategoricalMarketID': {
			buy: {
				'order1': {
					id: 1,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				},
				'order2': {
					id: 2,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				}
			},
			sell: {
				'order3': {
					id: 3,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				},
				'order4': {
					id: 4,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				}
			}
		},
		'testScalarMarketID': {
			buy: {
				'order1': {
					id: 1,
					price: '45',
					outcome: '1',
					owner: 'owner1'
				},
				'order2': {
					id: 2,
					price: '45',
					outcome: '1',
					owner: 'owner1'
				}
			},
			sell: {
				'order3': {
					id: 3,
					price: '40',
					outcome: '1',
					owner: 'owner1'
				},
				'order4': {
					id: 4,
					price: '40',
					outcome: '1',
					owner: 'owner1'
				}
			}
		}
	};
	const store = mockStore(testState);
	const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };
	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb();
		return { type: 'LOAD_BIDS_ASKS' };
	});

	sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
		cb('10');
	});

	sinon.stub(mockAugur.augur, 'getCashBalance', (takerAddress, cb) => {
		cb('10000.0');
	});

	sinon.stub(mockAugur.augur, 'trade', (args) => {
		const { max_value, max_amount, trade_ids, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed } = args;
		onTradeHash({ data: 'data' });
		onCommitSent({ data: 'data' });
		onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
		onCommitFailed({ error: 'error', message: 'error message' });
		onNextBlock({ data: 'data' });
		onTradeSent({ data: 'data' });
		if (mockAugur.augur.trade.callCount === 1) {
			onTradeSuccess({ sharesBought: '10', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
		} else {
			onTradeSuccess({ sharesBought: '0', cashFromTrade: '10', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp:1500000000 });
		}
		onTradeFailed({ error: 'error', message: 'error message' });
	});

	const mockCBStatus = sinon.stub();
	const mockCB = sinon.stub();

	const helper = proxyquire('../../../../src/modules/trade/actions/helpers/trade.js', {
		'../../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
		'../../../../services/augurjs': mockAugur
	});

	beforeEach(() => {
		store.clearActions();
		mockCB.reset();
		mockCBStatus.reset();
	});

	it('should help with sell trades', () => {
		// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, dispatch, cbStatus, cb
		helper.trade('testBinaryMarketID', '2', '10', '0', '0xtaker1', () => [3, 4], store.dispatch, mockCBStatus, mockCB);

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
		assert.deepEqual(mockCB.callCount, 3, `Didn't call the callback 3 times as expected`);
		assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }], `Didn't dispatch a load_bids_asks action as expected`);
	});

	it('should help with buy trades', () => {
		// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, dispatch, cbStatus, cb
		helper.trade('testBinaryMarketID', '2', '0', '10.01', '0xtaker1', () => [1, 2], store.dispatch, mockCBStatus, mockCB);

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
			filledShares: abi.bignum('0'),
			filledEth: abi.bignum('10'),
			remainingShares: abi.bignum('0'),
			remainingEth: abi.bignum('0')
		}), `Didn't call cbStatus with a filled status`);

		assert.deepEqual(mockCBStatus.callCount, 5, `Didn't call status callback 5 times as expected`);
		assert.deepEqual(mockCB.callCount, 3, `Didn't call the callback 3 times as expected`);
		assert.deepEqual(store.getActions(), [ { type: 'LOAD_BIDS_ASKS' }], `Didn't dispatch a load_bids_asks action as expected`);
	});
});
