import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { tradeTestState, tradeConstOrderBooks, stubUpdateExistingTransaction, stubLoadAccountTrades } from 'test/trade/constants';
import { augur, abi } from 'services/augurjs';

describe('modules/trade/actions/process-short-ask.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.orderBooks = tradeConstOrderBooks;
	const store = mockStore(testState);
	const mockAugurJS = { augur: { ...augur } };
	sinon.stub(mockAugurJS.augur, 'shortAsk', (arg) => {
		const { onSent, onSuccess, onFailed } = arg;
		onSent();
		onSuccess({
			hash: 'testhash',
			timestamp: 1500000000,
			gasFees: '0.02791268'
		});
		onFailed({ error: 0, message: 'error message!' });
	});
	const mockUpdateExisitngTransaction = { updateExistingTransaction: () => {} };
	sinon.stub(mockUpdateExisitngTransaction, 'updateExistingTransaction', stubUpdateExistingTransaction);
	const mockLoadAccountTrades = { loadAccountTrades: () => {} };
	sinon.stub(mockLoadAccountTrades, 'loadAccountTrades', stubLoadAccountTrades);
	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb(undefined, store.getState().orderBooks[marketID]);
		return { type: 'LOAD_BIDS_ASKS' };
	});

	const action = proxyquire('../../../src/modules/trade/actions/process-short-ask.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../transactions/actions/update-existing-transaction': mockUpdateExisitngTransaction,
		'../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
		'../../my-positions/actions/load-account-trades': mockLoadAccountTrades
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const expectedBinaryTradeActions = [
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans1',
			data: {
				status: 'placing short ask...',
				message: 'short asking 10 shares for -1.0010 ETH/share',
				freeze: {
					verb: 'freezing',
					noFeeCost: {
						value: -10.02,
						formattedValue: -10.02,
						formatted: '-10.0200',
						roundedValue: -10.02,
						rounded: '-10.0200',
						minimized: '-10.02',
						denomination: ' ETH',
						full: '-10.0200 ETH'
					},
					tradingFees: {
						value: 0.01,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH',
						full: '0.0100 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH (estimated)',
					full: '0.0279 real ETH (estimated)'
				}
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans1',
			data: {
				hash: 'testhash',
				timestamp: 1500000000,
				status: 'updating order book',
				message: 'short ask 10 shares for -1.0010 ETH/share',
				freeze: {
					verb: 'froze',
					noFeeCost: {
						value: -10.02,
						formattedValue: -10.02,
						formatted: '-10.0200',
						roundedValue: -10.02,
						rounded: '-10.0200',
						minimized: '-10.02',
						denomination: ' ETH',
						full: '-10.0200 ETH'
					},
					tradingFees: {
						value: 0.01,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH',
						full: '0.0100 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH',
					full: '0.0279 real ETH'
				}
			}
		},
		{ type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans1',
			data: { status: 'updating position' } },
		{ type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans1',
			data: { status: 'success' } },
		{ type: 'LOAD_ACCOUNT_TRADES', marketID: 'testBinaryMarketID' },
		{ type: 'LOAD_BIDS_ASKS' },
		{ type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans1',
			data: { status: 'failed', message: 'error message!' }
		}
	];

	it('should process an short ask order for a binary market given string inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));

		assert.deepEqual(store.getActions(), expectedBinaryTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a binary market given JS number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', 10, 0.5, -10.01, 0.01, 0.02791268));

		assert.deepEqual(store.getActions(), expectedBinaryTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a binary market given Big Number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', abi.bignum('10'), abi.bignum('0.5'), abi.bignum('-10.01'), abi.bignum('0.01'), abi.bignum('0.02791268')));

		assert.deepEqual(store.getActions(), expectedBinaryTradeActions, `Didn't produce the expected actions or calculations`);
	});

	const expectedCategoricalTradeActions = [
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans2',
			data: {
				status: 'placing short ask...',
				message: 'short asking 10 shares for -1.0005 ETH/share',
				freeze: {
					verb: 'freezing',
					noFeeCost: {
						value: -10.01,
						formattedValue: -10.01,
						formatted: '-10.0100',
						roundedValue: -10.01,
						rounded: '-10.0100',
						minimized: '-10.01',
						denomination: ' ETH',
						full: '-10.0100 ETH'
					},
					tradingFees: {
						value: 0.004999999999999995,
						formattedValue: 0.005,
						formatted: '0.0050',
						roundedValue: 0.005,
						rounded: '0.0050',
						minimized: '0.005',
						denomination: ' ETH',
						full: '0.0050 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH (estimated)',
					full: '0.0279 real ETH (estimated)'
				}
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans2',
			data: {
				hash: 'testhash',
				timestamp: 1500000000,
				status: 'updating order book',
				message: 'short ask 10 shares for -1.0005 ETH/share',
				freeze: {
					verb: 'froze',
					noFeeCost: {
						value: -10.01,
						formattedValue: -10.01,
						formatted: '-10.0100',
						roundedValue: -10.01,
						rounded: '-10.0100',
						minimized: '-10.01',
						denomination: ' ETH',
						full: '-10.0100 ETH'
					},
					tradingFees: {
						value: 0.004999999999999995,
						formattedValue: 0.005,
						formatted: '0.0050',
						roundedValue: 0.005,
						rounded: '0.0050',
						minimized: '0.005',
						denomination: ' ETH',
						full: '0.0050 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH',
					full: '0.0279 real ETH'
				}
			}
		},
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans2',
			data: { status: 'updating position' }
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans2',
			data: { status: 'success' }
		},
		{ type: 'LOAD_ACCOUNT_TRADES', marketID: 'testCategoricalMarketID' },
		{ type: 'LOAD_BIDS_ASKS' },
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans2',
			data: {
				status: 'failed',
				message: 'error message!'
			}
		}
	];

	it('should process an short ask order for a categorical market given string inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans2', 'testCategoricalMarketID', '1', '10', '0.5', '-10.004999999999999995', '0.004999999999999995', '0.02791268'));

		assert.deepEqual(store.getActions(), expectedCategoricalTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a categorical market given JS Number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans2', 'testCategoricalMarketID', '1', 10, 0.5, -10.004999999999999995, 0.004999999999999995, 0.02791268));

		assert.deepEqual(store.getActions(), expectedCategoricalTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a categorical market given Big Number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans2', 'testCategoricalMarketID', '1', abi.bignum('10'), abi.bignum('0.5'), abi.bignum('-10.004999999999999995'), abi.bignum('0.004999999999999995'), abi.bignum('0.02791268')));

		assert.deepEqual(store.getActions(), expectedCategoricalTradeActions, `Didn't produce the expected actions or calculations`);
	});

	const expectedScalarTradeActions = [
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				status: 'placing short ask...',
				message: 'short asking 20 shares for -1.5370 ETH/share',
				freeze: {
					verb: 'freezing',
					noFeeCost: {
						value: -41.4792899408284,
						formattedValue: -41.4793,
						formatted: '-41.4793',
						roundedValue: -41.4793,
						rounded: '-41.4793',
						minimized: '-41.4793',
						denomination: ' ETH',
						full: '-41.4793 ETH'
					},
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH',
						full: '10.7396 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH (estimated)',
					full: '0.0279 real ETH (estimated)'
				}
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				hash: 'testhash',
				timestamp: 1500000000,
				status: 'updating order book',
				message: 'short ask 20 shares for -1.5370 ETH/share',
				freeze: {
					verb: 'froze',
					noFeeCost: {
						value: -41.4792899408284,
						formattedValue: -41.4793,
						formatted: '-41.4793',
						roundedValue: -41.4793,
						rounded: '-41.4793',
						minimized: '-41.4793',
						denomination: ' ETH',
						full: '-41.4793 ETH'
					},
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH',
						full: '10.7396 ETH'
					}
				},
				gasFees: {
					value: 0.02791268,
					formattedValue: 0.0279,
					formatted: '0.0279',
					roundedValue: 0.0279,
					rounded: '0.0279',
					minimized: '0.0279',
					denomination: ' real ETH',
					full: '0.0279 real ETH'
				}
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				status: 'updating position'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				status: 'success'
			}
		}, {
			type: 'LOAD_ACCOUNT_TRADES',
			marketID: 'testScalarMarketID'
		}, {
			type: 'LOAD_BIDS_ASKS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				status: 'failed',
				message: 'error message!'
			}
		}
	];

	it('should process an short ask order for a scalar market given string inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans3', 'testScalarMarketID', '1', '20', '55', '-30.7396449704142005', '10.7396449704142005', '0.02791268'));

		assert.deepEqual(store.getActions(), expectedScalarTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a scalar market given JS Number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans3', 'testScalarMarketID', '1', 20, 55, -30.7396449704142005, 10.7396449704142005, 0.02791268));

		assert.deepEqual(store.getActions(), expectedScalarTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a scalar market given Big Number inputs', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans3', 'testScalarMarketID', '1', abi.bignum('20'), abi.bignum('55'), abi.bignum('-30.7396449704142005'), abi.bignum('10.7396449704142005'), abi.bignum('0.02791268')));

		assert.deepEqual(store.getActions(), expectedScalarTradeActions, `Didn't produce the expected actions or calculations`);
	});

	it('should handle a transactionID that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk(undefined, 'testBinaryMarketID', '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [], `processShortAsk produced actions when it shouldn't have when given a undefined transactionID.`);

		store.dispatch(action.processShortAsk(null, 'testBinaryMarketID', '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [], `processShortAsk produced actions when it shouldn't have when given a null transactionID.`);
	});

	const expectedGenericFail = [{
		type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'trans1',
		data: {
			status: 'failed',
			message: 'There was an issue processesing the Short Ask trade.'
		}
	}];

	it('should handle a marketID that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', undefined, '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a undefined marketID`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', null, '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a null marketID`);
	});

	it('should handle a outcomeID that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', undefined, '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a undefined outcomeID`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', null, '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a null outcomeID`);
	});

	it('should handle a numShares that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', undefined, '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [{ type: 'UPDATE_EXISTING_TRANSACTION', transactionID: 'trans1', data: { status: 'failed', message: 'invalid limit price "0.5" or shares "undefined"' } }], `processShortAsk produced unexpected actions when given a undefined numShares`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', null, '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [{ type: 'UPDATE_EXISTING_TRANSACTION', transactionID: 'trans1', data: { status: 'failed', message: 'invalid limit price "0.5" or shares "null"' } }], `processShortAsk produced unexpected actions when given a null numShares`);
	});

	it('should handle a limitPrice that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', undefined, '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [{ type: 'UPDATE_EXISTING_TRANSACTION', transactionID: 'trans1', data: { status: 'failed', message: 'invalid limit price "undefined" or shares "10"' } }], `processShortAsk produced unexpected actions when given a undefined limitPrice`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', null, '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [{ type: 'UPDATE_EXISTING_TRANSACTION', transactionID: 'trans1', data: { status: 'failed', message: 'invalid limit price "null" or shares "10"' } }], `processShortAsk produced unexpected actions when given a null limitPrice`);
	});

	it('should handle a totalEthWithFee that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', undefined, '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a undefined totalEthWithFee`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', null, '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a null totalEthWithFee`);
	});

	it('should handle a tradingFeesEth that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', '-10.01', undefined, '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a undefined tradingFeesEth`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', '-10.01', null, '0.02791268'));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a null tradingFeesEth`);
	});

	it('should handle a gasFeesRealEth that is undefined or null', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', '-10.01', '0.01', undefined));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a undefined gasFeesRealEth`);

		store.clearActions();

		store.dispatch(action.processShortAsk('trans1', 'testBinaryMarketID', '2', '10', '0.5', '-10.01', '0.01', null));
		assert.deepEqual(store.getActions(), expectedGenericFail, `processShortAsk produced unexpected actions when given a null gasFeesRealEth`);
	});
});
