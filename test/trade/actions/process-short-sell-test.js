import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../mockStore';
import { tradeTestState, tradeConstOrderBooks, stubAddShortAskTransaction, stubUpdateExistingTransaction, stubLoadAccountTrades } from '../constants';
import { abi } from '../../../src/services/augurjs';

describe('modules/trade/actions/process-short-sell.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.orderBooks = tradeConstOrderBooks;
	const store = mockStore(testState);
	const mockUpdateExisitngTransaction = { updateExistingTransaction: () => {} };
	sinon.stub(mockUpdateExisitngTransaction, 'updateExistingTransaction', stubUpdateExistingTransaction);

	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb(undefined, store.getState().orderBooks[marketID]);
		return { type: 'LOAD_BIDS_ASKS' };
	});
	const mockLoadAccountTrades = { loadAccountTrades: () => {} };
	sinon.stub(mockLoadAccountTrades, 'loadAccountTrades', stubLoadAccountTrades);
	const mockAddShortAskTransaction = { addShortAskTransaction: () => {} };
	sinon.stub(mockAddShortAskTransaction, 'addShortAskTransaction', stubAddShortAskTransaction);

	const mockShortSell = { shortSell: () => {} };
	sinon.stub(mockShortSell, 'shortSell', (marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb) => {
		assert.isString(marketID, `marketID passed to shortSell is not a string`);
		assert.isString(outcomeID, `outcomeID passed to shortSell is not a string`);
		assert.isString(numShares, `numShares passed to shortSell is not a string`);
		assert.isString(takerAddress, `takerAddress passed to shortSell is not a string`);
		assert.isArray(getTradeIDs(), `getTradeIDs() passed to shortSell doesn't return an array as expected`);
		assert.isFunction(cbStatus, `cbStatus passed to shortSell isn't a function`);
		assert.isFunction(cb, `cb passed to shortSell isn't a function`);
		let tradingFees;
		switch(marketID) {
			case 'testBinaryMarketID':
				tradingFees = '0.01536';
				break;
			case 'testCategoricalMarketID':
				tradingFees = '0.007679999999999992';
				break;
			case 'testScalarMarketID':
				tradingFees = '6.8165680473372776';
				break;
			default:
				tradingFees = '0';
				break;
		}
		cbStatus({ status: 'Testing', hash: 'testhash', timestamp: 1500000000, tradingFees, gasFees: '0.02791268' })
		cb({ code: 0, message: 'test error' }, undefined);
		cb(undefined, { filledEth: abi.bignum('0'), remainingShares: abi.bignum('20'),tradingFees: abi.bignum(tradingFees), gasFees: abi.bignum('0.02791268') });
	});
	const action = proxyquire('../../../src/modules/trade/actions/process-short-sell.js', {
		'../../transactions/actions/update-existing-transaction': mockUpdateExisitngTransaction,
		'../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
		'../../../modules/my-positions/actions/load-account-trades': mockLoadAccountTrades,
		'../../transactions/actions/add-short-ask-transaction': mockAddShortAskTransaction,
		'../../trade/actions/helpers/short-sell': mockShortSell
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should process an short sell order for a binary market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortSell('trans1', 'testBinaryMarketID', '2', '20', '0.4', '-20.01536', '0.01536', '0.02791268'));

		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'short selling 20 shares for -1.0008 ETH/share',
					totalCost: {
						value: -20.01536,
						formattedValue: -20.0154,
						formatted: '-20.0154',
						roundedValue: -20.0154,
						rounded: '-20.0154',
						minimized: '-20.0154',
						denomination: ' ETH (estimated)',
						full: '-20.0154 ETH (estimated)'
					},
					tradingFees: {
						value: 0.01536,
						formattedValue: 0.0154,
						formatted: '0.0154',
						roundedValue: 0.0154,
						rounded: '0.0154',
						minimized: '0.0154',
						denomination: ' ETH (estimated)',
						full: '0.0154 ETH (estimated)'
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
					status: 'Testing short sell...',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.01536,
						formattedValue: 0.0154,
						formatted: '0.0154',
						roundedValue: 0.0154,
						rounded: '0.0154',
						minimized: '0.0154',
						denomination: ' ETH',
						full: '0.0154 ETH'
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
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans1',
		    data: { status: 'failed', message: 'test error' } },
		  { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'short sold 0 shares for 0 ETH each',
					totalCost: {
						value: 0.01536,
						formattedValue: 0.0154,
						formatted: '0.0154',
						roundedValue: 0.0154,
						rounded: '0.0154',
						minimized: '0.0154',
						denomination: ' ETH',
						full: '0.0154 ETH'
					},
					tradingFees: {
						value: 0.01536,
						formattedValue: 0.0154,
						formatted: '0.0154',
						roundedValue: 0.0154,
						rounded: '0.0154',
						minimized: '0.0154',
						denomination: ' ETH',
						full: '0.0154 ETH'
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
				type: 'short_ask',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market',
					outcomeName: 'YES'
				},
				numShares: {
					value: 20,
					formattedValue: 20,
					formatted: '20',
					roundedValue: 20,
					rounded: '20.00',
					minimized: '20',
					denomination: ' shares',
					full: '20 shares'
				},
				noFeePrice: {
					value: 0.4,
					formattedValue: 0.4,
					formatted: '0.4000',
					roundedValue: 0.4,
					rounded: '0.4000',
					minimized: '0.4',
					denomination: ' ETH',
					full: '0.4000 ETH'
				},
				avgPrice: {
					value: 0.000768,
					formattedValue: 0.000768,
					formatted: '0.0007680',
					roundedValue: 0.0008,
					rounded: '0.0008',
					minimized: '0.000768',
					denomination: ' ETH',
					full: '0.0007680 ETH'
				},
				tradingFees: {
					value: 0.01536,
					formattedValue: 0.0154,
					formatted: '0.0154',
					roundedValue: 0.0154,
					rounded: '0.0154',
					minimized: '0.0154',
					denomination: ' ETH',
					full: '0.0154 ETH'
				},
				feePercent: {
					value: 0.199203187250996,
					formattedValue: 0.2,
					formatted: '0.2',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.2',
					denomination: '%',
					full: '0.2%'
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
			},
			{ type: 'UPDATE_EXISTING_TRANSACTION',
			 	transactionID: 'trans1',
			 	data: { status: 'success' } },
		 	{ type: 'LOAD_BIDS_ASKS' },
		 	{ type: 'LOAD_ACCOUNT_TRADES', marketID: 'testBinaryMarketID' }
		], `Didn't produce the expected Actions or Calculations`);
	});
	it('should process an short sell order for a categorical market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortSell('trans2', 'testCategoricalMarketID', '1', '20', '0.4', '-20.007679999999999992', '0.007679999999999992', '0.02791268'));

		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'short selling 20 shares for -1.0004 ETH/share',
					totalCost: {
						value: -20.00768,
						formattedValue: -20.0077,
						formatted: '-20.0077',
						roundedValue: -20.0077,
						rounded: '-20.0077',
						minimized: '-20.0077',
						denomination: ' ETH (estimated)',
						full: '-20.0077 ETH (estimated)'
					},
					tradingFees: {
						value: 0.007679999999999992,
						formattedValue: 0.0077,
						formatted: '0.0077',
						roundedValue: 0.0077,
						rounded: '0.0077',
						minimized: '0.0077',
						denomination: ' ETH (estimated)',
						full: '0.0077 ETH (estimated)'
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
					status: 'Testing short sell...',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.007679999999999992,
						formattedValue: 0.0077,
						formatted: '0.0077',
						roundedValue: 0.0077,
						rounded: '0.0077',
						minimized: '0.0077',
						denomination: ' ETH',
						full: '0.0077 ETH'
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
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'failed', message: 'test error' } },
		  { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'short sold 0 shares for 0 ETH each',
					totalCost: {
						value: 0.007679999999999992,
						formattedValue: 0.0077,
						formatted: '0.0077',
						roundedValue: 0.0077,
						rounded: '0.0077',
						minimized: '0.0077',
						denomination: ' ETH',
						full: '0.0077 ETH'
					},
					tradingFees: {
						value: 0.007679999999999992,
						formattedValue: 0.0077,
						formatted: '0.0077',
						roundedValue: 0.0077,
						rounded: '0.0077',
						minimized: '0.0077',
						denomination: ' ETH',
						full: '0.0077 ETH'
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
			{ type: 'short_ask',
		    data:
		     { marketID: 'testCategoricalMarketID',
		       outcomeID: '1',
		       marketType: 'categorical',
		       marketDescription: 'test categorical market',
		       outcomeName: 'Democratic' },
		    numShares:
		     { value: 20,
		       formattedValue: 20,
		       formatted: '20',
		       roundedValue: 20,
		       rounded: '20.00',
		       minimized: '20',
		       denomination: ' shares',
		       full: '20 shares' },
		    noFeePrice:
		     { value: 0.4,
		       formattedValue: 0.4,
		       formatted: '0.4000',
		       roundedValue: 0.4,
		       rounded: '0.4000',
		       minimized: '0.4',
		       denomination: ' ETH',
		       full: '0.4000 ETH' },
		    avgPrice:
		     { value: 0.0003839999999999996,
		       formattedValue: 0.000384,
		       formatted: '0.0003840',
		       roundedValue: 0.0004,
		       rounded: '0.0004',
		       minimized: '0.000384',
		       denomination: ' ETH',
		       full: '0.0003840 ETH' },
		    tradingFees:
		     { value: 0.007679999999999992,
		       formattedValue: 0.0077,
		       formatted: '0.0077',
		       roundedValue: 0.0077,
		       rounded: '0.0077',
		       minimized: '0.0077',
		       denomination: ' ETH',
		       full: '0.0077 ETH' },
		    feePercent:
		     { value: 0.09980039920159671,
		       formattedValue: 0.1,
		       formatted: '0.1',
		       roundedValue: 0,
		       rounded: '0',
		       minimized: '0.1',
		       denomination: '%',
		       full: '0.1%' },
		    gasFees:
		     { value: 0.02791268,
		       formattedValue: 0.0279,
		       formatted: '0.0279',
		       roundedValue: 0.0279,
		       rounded: '0.0279',
		       minimized: '0.0279',
		       denomination: ' real ETH',
		       full: '0.0279 real ETH' } },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'success' } },
		  { type: 'LOAD_BIDS_ASKS' },
		  { type: 'LOAD_ACCOUNT_TRADES', marketID: 'testCategoricalMarketID' }
		], `Didn't produce the expected Actions or Calculations`);
	});
	it('should process an short sell order for a scalar market', () => {
		// transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth
		store.dispatch(action.processShortSell('trans3', 'testScalarMarketID', '1', '20', '40', '-26.8165680473372776', '6.8165680473372776', '0.02791268'));

		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'short selling 20 shares for -1.3408 ETH/share',
					totalCost: {
						value: -26.816568047337277,
						formattedValue: -26.8166,
						formatted: '-26.8166',
						roundedValue: -26.8166,
						rounded: '-26.8166',
						minimized: '-26.8166',
						denomination: ' ETH (estimated)',
						full: '-26.8166 ETH (estimated)'
					},
					tradingFees: {
						value: 6.816568047337277,
						formattedValue: 6.8166,
						formatted: '6.8166',
						roundedValue: 6.8166,
						rounded: '6.8166',
						minimized: '6.8166',
						denomination: ' ETH (estimated)',
						full: '6.8166 ETH (estimated)'
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
					status: 'Testing short sell...',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 6.816568047337277,
						formattedValue: 6.8166,
						formatted: '6.8166',
						roundedValue: 6.8166,
						rounded: '6.8166',
						minimized: '6.8166',
						denomination: ' ETH',
						full: '6.8166 ETH'
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
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
  		{ type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans3',
		    data: { status: 'failed', message: 'test error' } },
		  { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'short sold 0 shares for 0 ETH each',
					totalCost: {
						value: 6.816568047337277,
						formattedValue: 6.8166,
						formatted: '6.8166',
						roundedValue: 6.8166,
						rounded: '6.8166',
						minimized: '6.8166',
						denomination: ' ETH',
						full: '6.8166 ETH'
					},
					tradingFees: {
						value: 6.816568047337277,
						formattedValue: 6.8166,
						formatted: '6.8166',
						roundedValue: 6.8166,
						rounded: '6.8166',
						minimized: '6.8166',
						denomination: ' ETH',
						full: '6.8166 ETH'
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
				type: 'short_ask',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market',
					outcomeName: ''
				},
				numShares: {
					value: 20,
					formattedValue: 20,
					formatted: '20',
					roundedValue: 20,
					rounded: '20.00',
					minimized: '20',
					denomination: ' shares',
					full: '20 shares'
				},
				noFeePrice: {
					value: 40,
					formattedValue: 40,
					formatted: '40.0000',
					roundedValue: 40,
					rounded: '40.0000',
					minimized: '40',
					denomination: ' ETH',
					full: '40.0000 ETH'
				},
				avgPrice: {
					value: 0.3408284023668639,
					formattedValue: 0.3408,
					formatted: '0.3408',
					roundedValue: 0.3408,
					rounded: '0.3408',
					minimized: '0.3408',
					denomination: ' ETH',
					full: '0.3408 ETH'
				},
				tradingFees: {
					value: 6.816568047337277,
					formattedValue: 6.8166,
					formatted: '6.8166',
					roundedValue: 6.8166,
					rounded: '6.8166',
					minimized: '6.8166',
					denomination: ' ETH',
					full: '6.8166 ETH'
				},
				feePercent: {
					value: 0.9576320371445153,
					formattedValue: 1,
					formatted: '1.0',
					roundedValue: 1,
					rounded: '1',
					minimized: '1',
					denomination: '%',
					full: '1.0%'
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
			},
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans3',
		    data: { status: 'success' } },
		  { type: 'LOAD_BIDS_ASKS' },
		  { type: 'LOAD_ACCOUNT_TRADES', marketID: 'testScalarMarketID' }
		], `Didn't produce the expected Actions or Calculations`);
	});
});
