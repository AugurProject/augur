import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../mockStore';
import { tradeTestState } from '../constants';
import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../src/utils/format-number';
import { abi } from '../../../src/services/augurjs';

describe('modules/trade/actions/process-buy.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	tradeTestState.transactionsData = {
		'trans1': {
			data: {
				marketID: '0x000000000000000000000000000000000binary1',
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
				marketID: '0x0000000000000000000000000000categorical1',
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
				marketID: '0x000000000000000000000000000000000scalar1',
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
	tradeTestState.orderBooks = {
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
	const testState = Object.assign({}, state, tradeTestState);
	const store = mockStore(testState);
	const mockTrade = { trade: () => {} };
	sinon.stub(mockTrade, 'trade', (...args) => {
		// console.log('args:', args);
		args[5]();
		args[7]({
			status: 'success',
			hash: 'testhash',
			timestamp: 1500000000,
			tradingFees: '0.01',
			gasFees: '0.01450404',
			remainingEth: '500.0',
			filledShares: '10'
		});
		args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
		args[8](undefined, {
			remainingEth: '500.0',
			filledShares: '10',
			tradingFees: '0.01',
			gasFees: '0.01450404'
		});
	});
	const mockAddBidTransaction = { addBidTransaction: () => {} };
	sinon.stub(mockAddBidTransaction, 'addBidTransaction', (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
		const transaction = {
			type: BID,
			data: {
				marketID,
				outcomeID,
				marketType,
				marketDescription,
				outcomeName
			},
			numShares: formatShares(numShares),
			noFeePrice: formatEther(limitPrice),
			avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
			tradingFees: formatEther(tradingFeesEth),
			feePercent: formatPercent(feePercent),
			gasFees: formatRealEther(gasFeesRealEth)
		};
		return transaction;
	});
	const mockUpdateExisitngTransaction = { updateExistingTransaction: () => {} };
	sinon.stub(mockUpdateExisitngTransaction, 'updateExistingTransaction', (transactionID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTION', transactionID, data };
	});
	const mockLoadAccountTrades = { loadAccountTrades: () => {} };
	sinon.stub(mockLoadAccountTrades, 'loadAccountTrades', (...args) => {
		args[1]();
		return { type: 'LOAD_ACCOUNT_TRADES', marketID: args[0] };
	});

	const action = proxyquire('../../../src/modules/trade/actions/process-buy.js', {
		'../../trade/actions/helpers/trade': mockTrade,
		'../../transactions/actions/add-bid-transaction': mockAddBidTransaction,
		'../../../modules/my-positions/actions/load-account-trades': mockLoadAccountTrades,
		'../../transactions/actions/update-existing-transaction': mockUpdateExisitngTransaction
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should process a buy order for a binary market where all buy orders are filled', () => {
		store.dispatch(action.processBuy('trans1', '0x000000000000000000000000000000000binary1', '2', '10', '0.5', '5.01', '0.01', '0.01450404'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'buying 10 shares for 0.5010 ETH/share',
					totalCost: {
						value: 5.01,
						formattedValue: 5.01,
						formatted: '5.0100',
						roundedValue: 5.01,
						rounded: '5.0100',
						minimized: '5.01',
						denomination: ' ETH (estimated)',
						full: '5.0100 ETH (estimated)'
					},
					tradingFees: {
						value: 0.01,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH (estimated)',
						full: '0.0100 ETH (estimated)'
					},
					gasFees: {
						value: 0.01450404,
						formattedValue: 0.0145,
						formatted: '0.0145',
						roundedValue: 0.0145,
						rounded: '0.0145',
						minimized: '0.0145',
						denomination: ' real ETH (estimated)',
						full: '0.0145 real ETH (estimated)'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'success buy',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.01,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH',
						full: '0.0100 ETH'
					},
					gasFees: {
						value: 0.01450404,
						formattedValue: 0.0145,
						formatted: '0.0145',
						roundedValue: 0.0145,
						rounded: '0.0145',
						minimized: '0.0145',
						denomination: ' real ETH',
						full: '0.0145 real ETH'
					},
					message: 'bought 10 of 10 shares for -49.4990 ETH/share',
					totalCost: {
						value: -494.99,
						formattedValue: -494.99,
						formatted: '-494.9900',
						roundedValue: -494.99,
						rounded: '-494.9900',
						minimized: '-494.99',
						denomination: ' ETH',
						full: '-494.9900 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'failed',
					message: 'this error is a test.'
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'bought 10 shares for -49.4990 ETH/share',
					totalCost: {
						value: -494.99,
						formattedValue: -494.99,
						formatted: '-494.9900',
						roundedValue: -494.99,
						rounded: '-494.9900',
						minimized: '-494.99',
						denomination: ' ETH',
						full: '-494.9900 ETH'
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
					},
					gasFees: {
						value: 0.01450404,
						formattedValue: 0.0145,
						formatted: '0.0145',
						roundedValue: 0.0145,
						rounded: '0.0145',
						minimized: '0.0145',
						denomination: ' real ETH',
						full: '0.0145 real ETH'
					}
				}
			},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'success'
				}
			},
			{
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions`);
	});

	it('should process a buy order for a binary market where all buy orders are NOT filled');

	it.skip('should process a buy order for a categorical market where all buy orders are filled', () => {
		store.dispatch(action.processBuy('trans2', '0x0000000000000000000000000000categorical1', '1', '10', '0.5', '5.004999999999999995', '0.004999999999999995', '0.01450404'));
		console.log(store.getActions());
	});

	it('should process a buy order for a categorical market where all buy orders are NOT filled');

	it.skip('should process a buy order for a scalar market where all buy orders are filled', () => {
		store.dispatch(action.processBuy('trans3', '0x000000000000000000000000000000000scalar1', '1', '10', '55', '555.36982248520710025', '5.36982248520710025', '0.01450404'));
		console.log(store.getActions());
	});

	it('should process a buy order for a scalar market where all buy orders are NOT filled');
});
