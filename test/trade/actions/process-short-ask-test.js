import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../mockStore';
import { tradeTestState } from '../constants';
import { augur } from '../../../src/services/augurjs';

describe('modules/trade/actions/process-short-ask.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.orderBooks = {
		'0x000000000000000000000000000000000binary1': {
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
		'0x0000000000000000000000000000categorical1': {
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
		'0x000000000000000000000000000000000scalar1': {
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
	const mockAugurJS = { augur: {...augur} };
	sinon.stub(mockAugurJS.augur, 'shortAsk', (arg) => {
		const { amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed } = arg;
		onSent();
		onSuccess({
			hash: 'testhash',
			timestamp: 1500000000,
			gasFees: '0.02791268'
		});
		onFailed({ error: 0, message: 'error message!' });
	});
	const mockUpdateExisitngTransaction = { updateExistingTransaction: () => {} };
	sinon.stub(mockUpdateExisitngTransaction, 'updateExistingTransaction', (transactionID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTION', transactionID, data };
	});
	const mockLoadAccountTrades = { loadAccountTrades: () => {} };
	sinon.stub(mockLoadAccountTrades, 'loadAccountTrades', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadAccountTrades`);
		cb(undefined, store.getState().orderBooks[marketID]);
		return { type: 'LOAD_ACCOUNT_TRADES' };
	});
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

	it('should process an short ask order for a binary market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans1', '0x000000000000000000000000000000000binary1', '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));

		assert.deepEqual(store.getActions(), [
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
		  { type: 'LOAD_ACCOUNT_TRADES' },
		  { type: 'LOAD_BIDS_ASKS' },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans1',
		    data: { status: 'failed', message: 'error message!' }
			}
		], `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a categorical market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans2', '0x0000000000000000000000000000categorical1', '1', '10', '0.5', '-10.004999999999999995', '0.004999999999999995', '0.02791268'));

		assert.deepEqual(store.getActions(), [
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
			{ type: 'LOAD_ACCOUNT_TRADES' },
			{ type: 'LOAD_BIDS_ASKS' },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'failed',
					message: 'error message!'
				}
			}], `Didn't produce the expected actions or calculations`);
	});

	it('should process an short ask order for a scalar market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortAsk('trans3', '0x000000000000000000000000000000000scalar1', '1', '20', '55', '-30.7396449704142005', '10.7396449704142005', '0.02791268'));

		assert.deepEqual(store.getActions(), [{
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
		},
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: { status: 'updating position' }
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: { status: 'success' }
		},
		{ type: 'LOAD_ACCOUNT_TRADES' },
		{ type: 'LOAD_BIDS_ASKS' },
		{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 'trans3',
			data: {
				status: 'failed',
				message: 'error message!'
			}
		}], `Didn't produce the expected actions or calculations`);
	});
});
