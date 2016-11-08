import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../mockStore';
import { tradeTestState } from '../constants';

describe('modules/trade/actions/process-bid.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	const store = mockStore(testState);
	const mockAugur = { augur: { buy: () => {} } };
	sinon.stub(mockAugur.augur, "buy", (argsObj) => {
		assert.isString(argsObj.amount, `Didn't pass the amount as a string as expected`);
		assert.isString(argsObj.price, `Didn't pass the price as string as expected`);
		assert.isString(argsObj.market, `Didn't pass a string for the market ID as expected`);
		assert.isString(argsObj.outcome, `Didn't pass the outcomeID as a string`);
		assert.isObject(argsObj.scalarMinMax, `Didn't pass the scalarMinMax as an object as expected.`);
		argsObj.onSuccess({ hash: 'testHash', timestamp: 1480000000, gasFees: '0.1' });
		argsObj.onFailed({ message: 'this is an error' });
	});
	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb();
		return { type: 'LOAD_BIDS_ASKS' };
	})
	const mockUpdateExisitngTransaction = { updateExistingTransaction: () => {} };
	sinon.stub(mockUpdateExisitngTransaction, 'updateExistingTransaction', (transactionID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTION', transactionID, data };
	});

	const action = proxyquire('../../../src/modules/trade/actions/process-bid.js', {
		'../../../services/augurjs': mockAugur,
		'../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
		'../../transactions/actions/update-existing-transaction': mockUpdateExisitngTransaction
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should process a bid for a binary market', () => {
			store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', '0.1234', '0.1', '0.005'));
			assert.deepEqual(store.getActions(), [
				{
					type: 'UPDATE_EXISTING_TRANSACTION',
					transactionID: 'transid1',
					data: {
						status: 'placing bid...',
						message: 'bidding 10 shares for 0.0123 ETH/share',
						freeze: {
							verb: 'freezing',
							noFeeCost: {
								value: 0.0234,
								formattedValue: 0.0234,
								formatted: '0.0234',
								roundedValue: 0.0234,
								rounded: '0.0234',
								minimized: '0.0234',
								denomination: ' ETH',
								full: '0.0234 ETH'
							},
							tradingFees: {
								value: 0.1,
								formattedValue: 0.1,
								formatted: '0.1000',
								roundedValue: 0.1,
								rounded: '0.1000',
								minimized: '0.1',
								denomination: ' ETH',
								full: '0.1000 ETH'
							}
						},
						gasFees: {
							value: 0.005,
							formattedValue: 0.005,
							formatted: '0.0050',
							roundedValue: 0.005,
							rounded: '0.0050',
							minimized: '0.005',
							denomination: ' real ETH (estimated)',
							full: '0.0050 real ETH (estimated)'
						}
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTION',
					transactionID: 'transid1',
					data: {
						hash: 'testHash',
						timestamp: 1480000000,
						status: 'updating order book',
						message: 'bid 10 shares for 0.0123 ETH/share',
						freeze: {
							verb: 'froze',
							noFeeCost: {
								value: 0.0234,
								formattedValue: 0.0234,
								formatted: '0.0234',
								roundedValue: 0.0234,
								rounded: '0.0234',
								minimized: '0.0234',
								denomination: ' ETH',
								full: '0.0234 ETH'
							},
							tradingFees: {
								value: 0.1,
								formattedValue: 0.1,
								formatted: '0.1000',
								roundedValue: 0.1,
								rounded: '0.1000',
								minimized: '0.1',
								denomination: ' ETH',
								full: '0.1000 ETH'
							}
						},
						gasFees: {
							value: 0.1,
							formattedValue: 0.1,
							formatted: '0.1000',
							roundedValue: 0.1,
							rounded: '0.1000',
							minimized: '0.1',
							denomination: ' real ETH',
							full: '0.1000 real ETH'
						}
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTION',
					transactionID: 'transid1',
					data: { status: 'success'}
				},
				{ type: 'LOAD_BIDS_ASKS' },
				{ type: 'UPDATE_EXISTING_TRANSACTION',
  				transactionID: 'transid1',
  				data: { status: 'failed', message: 'this is an error' }
				}
			], `Actions Dispatched didn't match up with expectations`);
	});

	it('should process a bid for a categorical market', () => {
		store.dispatch(action.processBid('transid2', 'testCategoricalMarketID', '1', '15', '0.55', '0.05', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid2',
				data: {
					status: 'placing bid...',
					message: 'bidding 15 shares for 0.0033 ETH/share',
					freeze: {
						verb: 'freezing',
						noFeeCost: {
							value: -0.05,
							formattedValue: -0.05,
							formatted: '-0.0500',
							roundedValue: -0.05,
							rounded: '-0.0500',
							minimized: '-0.05',
							denomination: ' ETH',
							full: '-0.0500 ETH'
						},
						tradingFees: {
							value: 0.1,
							formattedValue: 0.1,
							formatted: '0.1000',
							roundedValue: 0.1,
							rounded: '0.1000',
							minimized: '0.1',
							denomination: ' ETH',
							full: '0.1000 ETH'
						}
					},
					gasFees: {
						value: 0.005,
						formattedValue: 0.005,
						formatted: '0.0050',
						roundedValue: 0.005,
						rounded: '0.0050',
						minimized: '0.005',
						denomination: ' real ETH (estimated)',
						full: '0.0050 real ETH (estimated)'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid2',
				data: {
					hash: 'testHash',
					timestamp: 1480000000,
					status: 'updating order book',
					message: 'bid 15 shares for 0.0033 ETH/share',
					freeze: {
						verb: 'froze',
						noFeeCost: {
							value: -0.05,
							formattedValue: -0.05,
							formatted: '-0.0500',
							roundedValue: -0.05,
							rounded: '-0.0500',
							minimized: '-0.05',
							denomination: ' ETH',
							full: '-0.0500 ETH'
						},
						tradingFees: {
							value: 0.1,
							formattedValue: 0.1,
							formatted: '0.1000',
							roundedValue: 0.1,
							rounded: '0.1000',
							minimized: '0.1',
							denomination: ' ETH',
							full: '0.1000 ETH'
						}
					},
					gasFees: {
						value: 0.1,
						formattedValue: 0.1,
						formatted: '0.1000',
						roundedValue: 0.1,
						rounded: '0.1000',
						minimized: '0.1',
						denomination: ' real ETH',
						full: '0.1000 real ETH'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid2',
				data: { status: 'success'}
			},
			{ type: 'LOAD_BIDS_ASKS' },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid2',
				data: { status: 'failed', message: 'this is an error' }
			}
		], `Actions Dispatched didn't match up with expectations`);
	});

	it('should process a bid for a scalar market', () => {
		store.dispatch(action.processBid('transid3', 'testScalarMarketID', '1', '20', '55', '0.15', '0.2', '0.015'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid3',
				data: {
					status: 'placing bid...',
					message: 'bidding 20 shares for 0.0075 ETH/share',
					freeze: {
						verb: 'freezing',
						noFeeCost: {
							value: -0.05,
							formattedValue: -0.05,
							formatted: '-0.0500',
							roundedValue: -0.05,
							rounded: '-0.0500',
							minimized: '-0.05',
							denomination: ' ETH',
							full: '-0.0500 ETH'
						},
						tradingFees: {
							value: 0.2,
							formattedValue: 0.2,
							formatted: '0.2000',
							roundedValue: 0.2,
							rounded: '0.2000',
							minimized: '0.2',
							denomination: ' ETH',
							full: '0.2000 ETH'
						}
					},
					gasFees: {
						value: 0.015,
						formattedValue: 0.015,
						formatted: '0.0150',
						roundedValue: 0.015,
						rounded: '0.0150',
						minimized: '0.015',
						denomination: ' real ETH (estimated)',
						full: '0.0150 real ETH (estimated)'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid3',
				data: {
					hash: 'testHash',
					timestamp: 1480000000,
					status: 'updating order book',
					message: 'bid 20 shares for 0.0075 ETH/share',
					freeze: {
						verb: 'froze',
						noFeeCost: {
							value: -0.05,
							formattedValue: -0.05,
							formatted: '-0.0500',
							roundedValue: -0.05,
							rounded: '-0.0500',
							minimized: '-0.05',
							denomination: ' ETH',
							full: '-0.0500 ETH'
						},
						tradingFees: {
							value: 0.2,
							formattedValue: 0.2,
							formatted: '0.2000',
							roundedValue: 0.2,
							rounded: '0.2000',
							minimized: '0.2',
							denomination: ' ETH',
							full: '0.2000 ETH'
						}
					},
					gasFees: {
						value: 0.1,
						formattedValue: 0.1,
						formatted: '0.1000',
						roundedValue: 0.1,
						rounded: '0.1000',
						minimized: '0.1',
						denomination: ' real ETH',
						full: '0.1000 real ETH'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid3',
				data: { status: 'success'}
			},
			{ type: 'LOAD_BIDS_ASKS' },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'transid3',
				data: { status: 'failed', message: 'this is an error' }
			}
		], `Actions Dispatched didn't match up with expectations`);
	});

	it(`should fail gracefully if transactionID is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid(undefined, 'testBinaryMarketID', '2', '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [], `Dispatched action objects when nothing should have been dispatched.`);
		// Both should return no actions, this should simply return a console.error in the event of transactionID being undefined/null
		store.dispatch(action.processBid(null, 'testBinaryMarketID', '2', '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [], `Dispatched action objects when nothing should have been dispatched.`);
	});

	it(`should fail gracefully if totalEthWithFee is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', undefined, '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "0.5" or total "undefined"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);

		store.clearActions();

		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', null, '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "0.5" or total "null"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);
	});

	it(`should fail gracefully if limitPrice is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', undefined, '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "undefined" or total "0.1234"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);

		store.clearActions();

		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', null, '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "null" or total "0.1234"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);
	});

	it(`should fail gracefully if limitPrice and totalEthWithFee are both null or both undefined`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', null, null, '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "null" or total "null"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);

		store.clearActions();

		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', undefined, undefined, '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'invalid limit price "undefined" or total "undefined"' } } ], `Didn't dispatch a failed UPDATE_EXISTING_TRANSACTION action object`);
	});

	it(`Should fail gracefully if marketID is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', undefined, '2', '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);

		store.clearActions();
		store.dispatch(action.processBid('transid1', null, '2', '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);
	});

	it(`Should fail gracefully if outcomeID is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', undefined, '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);

		store.clearActions();
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', null, '10', '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);
	});

	it(`Should fail gracefully if numShares is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', undefined, '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);

		store.clearActions();
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', null, '0.5', '0.1234', '0.1', '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);
	});

	it(`Should fail gracefully if tradingFeesEth is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', '0.1234', undefined, '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);

		store.clearActions();
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', '0.1234', null, '0.005'));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);
	});

	it(`Should fail gracefully if gasFeesRealEth is undefined or null`, () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', '0.1234', '0.1', undefined));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);

		store.clearActions();
		store.dispatch(action.processBid('transid1', 'testBinaryMarketID', '2', '10', '0.5', '0.1234', '0.1', null));
		assert.deepEqual(store.getActions(), [ { type: 'UPDATE_EXISTING_TRANSACTION',
		transactionID: 'transid1',
		data:
		 { status: 'failed',
			 message: 'There was an issue processesing the bid trade.' } } ], `Didn't dispatch the failed transaction action object`);
	});
});
