import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from '../../mockStore';
import { tradeTestState } from '../constants';
import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../src/utils/format-number';
import { abi } from '../../../src/services/augurjs';

describe('modules/trade/actions/process-sell.js', () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.transactionsData = {
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
	testState.orderBooks = {
		'0x000000000000000000000000000000000binary1': {
			buy: {
				'order1': {
					id: 1,
					price: '0.45',
					outcome: '2',
					owner: 'owner1'
				},
				'order2': {
					id: 2,
					price: '0.45',
					outcome: '2',
					owner: 'owner1'
				}
			},
			sell: {
				'order3': {
					id: 3,
					price: '0.4',
					outcome: '2',
					owner: 'owner1'
				},
				'order4': {
					id: 4,
					price: '0.4',
					outcome: '2',
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
	const mockTrade = { trade: () => {} };
	sinon.stub(mockTrade, 'trade', (...args) => {
		args[5]();
		switch (args[0]) {
		case '0x000000000000000000000000000000000binary1':
			switch (mockTrade.trade.callCount) {
				case 1:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '0.01',
						gasFees: '0.02791268',
						filledShares: '10',
						filledEth: '10',
						remainingShares: '0'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						filledShares: abi.bignum('10'),
						filledEth: abi.bignum('10.00'),
						tradingFees: abi.bignum('0.01'),
						gasFees: abi.bignum('0.02791268'),
						remainingShares: abi.bignum('0')
					});
					break;
				case 2:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '0.02',
						gasFees: '0.02791268',
						filledShares: '15',
						filledEth: '15',
						remainingShares: '5'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						filledShares: abi.bignum('15'),
						filledEth: abi.bignum('15.00'),
						tradingFees: abi.bignum('0.02'),
						gasFees: abi.bignum('0.02791268'),
						remainingShares: abi.bignum('5')
					});
					break;
				case 3:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '0.01536',
						gasFees: '0.02791268',
						filledShares: '5',
						filledEth: '5',
						remainingShares: '15'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						filledShares: abi.bignum('5'),
						filledEth: abi.bignum('5'),
						tradingFees: abi.bignum('0.01536'),
						gasFees: abi.bignum('0.02791268'),
						remainingShares: abi.bignum('15')
					});
					break;
				case 4:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '0.02',
						gasFees: '0.02791268',
						filledShares: '0',
						filledEth: '0',
						remainingShares: '20'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						filledShares: abi.bignum('0'),
						filledEth: abi.bignum('0'),
						tradingFees: abi.bignum('0.02'),
						gasFees: abi.bignum('0.02791268'),
						remainingShares: abi.bignum('20')
					});
					break;
				case 5:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '0.01536',
						gasFees: '0.02791268',
						filledShares: '0',
						filledEth: '0',
						remainingShares: '20'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						filledShares: abi.bignum('0'),
						filledEth: abi.bignum('0'),
						tradingFees: abi.bignum('0.01536'),
						gasFees: abi.bignum('0.02791268'),
						remainingShares: abi.bignum('20')
					});
					break;
				default:
					console.log('binary default break. callCount:', mockTrade.trade.callCount);
					break;
			}
			break;
		case '0x0000000000000000000000000000categorical1':
			switch (mockTrade.trade.callCount) {
			case 1:
				args[7]({
					status: 'success',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: '0.004999999999999995',
					gasFees: '0.02791268',
					remainingShares: '0',
					filledShares: '10',
					filledEth: '10',
				});
				args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
				args[8](undefined, {
					remainingShares: abi.bignum('0'),
					filledShares: abi.bignum('10'),
					filledEth: abi.bignum('10'),
					tradingFees: abi.bignum('0.004999999999999995'),
					gasFees: abi.bignum('0.02791268')
				});
				break;
			case 2:
				args[7]({
					status: 'success',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: '0.00999999999999999',
					gasFees: '0.02791268',
					filledShares: '15',
					filledEth: '15',
					remainingShares: '5'
				});
				args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
				args[8](undefined, {
					filledShares: abi.bignum('15'),
					filledEth: abi.bignum('15.00'),
					tradingFees: abi.bignum('0.00999999999999999'),
					gasFees: abi.bignum('0.02791268'),
					remainingShares: abi.bignum('5')
				});
				break;
			case 3:
				args[7]({
					status: 'success',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: '0.007679999999999992',
					gasFees: '0.02791268',
					filledShares: '5',
					filledEth: '5',
					remainingShares: '15'
				});
				args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
				args[8](undefined, {
					filledShares: abi.bignum('5'),
					filledEth: abi.bignum('5'),
					tradingFees: abi.bignum('0.007679999999999992'),
					gasFees: abi.bignum('0.02791268'),
					remainingShares: abi.bignum('15')
				});
				break;
			case 4:
				args[7]({
					status: 'success',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: '0.02',
					gasFees: '0.02791268',
					filledShares: '0',
					filledEth: '0',
					remainingShares: '20'
				});
				args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
				args[8](undefined, {
					filledShares: abi.bignum('0'),
					filledEth: abi.bignum('0'),
					tradingFees: abi.bignum('0.02'),
					gasFees: abi.bignum('0.02791268'),
					remainingShares: abi.bignum('20')
				});
				break;
			case 5:
				args[7]({
					status: 'success',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: '0.007679999999999992',
					gasFees: '0.02791268',
					filledShares: '0',
					filledEth: '0',
					remainingShares: '20'
				});
				args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
				args[8](undefined, {
					filledShares: abi.bignum('0'),
					filledEth: abi.bignum('0'),
					tradingFees: abi.bignum('0.007679999999999992'),
					gasFees: abi.bignum('0.02791268'),
					remainingShares: abi.bignum('20')
				});
				break;
			default:
				console.log('trade cat default hit', mockTrade.trade.callCount);
				break;
			}
			break;
		case '0x000000000000000000000000000000000scalar1':
			switch (mockTrade.trade.callCount) {
				case 1:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '5.36982248520710025',
						gasFees: '0.02791268',
						filledShares: '10',
						filledEth: '15.36982248520710025',
						remainingShares: '0'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						remainingShares: abi.bignum('0'),
						filledShares: abi.bignum('10'),
						filledEth: abi.bignum('15.36982248520710025'),
						tradingFees: abi.bignum('5.36982248520710025'),
						gasFees: abi.bignum('0.02791268')
					});
					break;
				case 2:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '10.7396449704142005',
						gasFees: '0.02791268',
						filledShares: '15',
						filledEth: '25.7396449704142005',
						remainingShares: '5'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						tradingFees: abi.bignum('10.7396449704142005'),
						gasFees: abi.bignum('0.02791268'),
						filledShares: abi.bignum('15'),
						filledEth: abi.bignum('25.7396449704142005'),
						remainingShares: abi.bignum('5')
					});
					break;
				case 3:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '6.8165680473372776',
						gasFees: '0.02791268',
						filledShares: '5',
						filledEth: '11.8165680473372776',
						remainingShares: '15'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						tradingFees: abi.bignum('6.8165680473372776'),
						gasFees: abi.bignum('0.02791268'),
						filledShares: abi.bignum('5'),
						filledEth: abi.bignum('11.8165680473372776'),
						remainingShares: abi.bignum('15'),
					});
					break;
				case 4:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '10.7396449704142005',
						gasFees: '0.02791268',
						filledShares: '0',
						filledEth: '0',
						remainingShares: '20'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						remainingShares: abi.bignum('20'),
						filledShares: abi.bignum('0'),
						filledEth: abi.bignum('0'),
						tradingFees: abi.bignum('10.7396449704142005'),
						gasFees: abi.bignum('0.02791268')
					});
					break;
				case 5:
					args[7]({
						status: 'success',
						hash: 'testhash',
						timestamp: 1500000000,
						tradingFees: '6.8165680473372776',
						gasFees: '0.02791268',
						filledShares: '0',
						filledEth: '0',
						remainingShares: '20'
					});
					args[8]({ type: 'testError', message: 'this error is a test.'}, undefined);
					args[8](undefined, {
						remainingShares: abi.bignum('20'),
						filledShares: abi.bignum('0'),
						filledEth: abi.bignum('0'),
						tradingFees: abi.bignum('6.8165680473372776'),
						gasFees: abi.bignum('0.02791268')
					});
					break;
				default:
					console.log('scalar default break, callcount: ', mockTrade.trade.callCount);
					break;
			}
			break;
		default:
			break;
		}
	});
	const mockAddAskTransaction = { addAskTransaction: () => {} };
	sinon.stub(mockAddAskTransaction, 'addAskTransaction', (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
		const transaction = {
			type: 'ask',
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
	const mockAddShortAskTransaction = { addShortAskTransaction: () => {} };
	sinon.stub(mockAddShortAskTransaction, 'addShortAskTransaction', (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
		const transaction = {
			type: 'short_ask',
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
	const mockAddShortSellTransaction = { addShortSellTransaction: () => {} };
	sinon.stub(mockAddShortSellTransaction, 'addShortSellTransaction', (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
		const transaction = {
			type: 'short_sell',
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
	const mockAugur = { augur: { getParticipantSharesPurchased: () => {} } };
	sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
		switch (mockAugur.augur.getParticipantSharesPurchased.callCount) {
			case 1:
				cb(15);
				break;
			case 2:
				cb(5);
				break;
			default:
				cb(0);
				break;
		}
	});
	const mockLoadBidAsks = { loadBidsAsks: () => {} };
	sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
		assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
		cb(undefined, store.getState().orderBooks[marketID]);
		return { type: 'LOAD_BIDS_ASKS' };
	})

	const action = proxyquire('../../../src/modules/trade/actions/process-sell.js', {
		'../../../services/augurjs': mockAugur,
		'../../trade/actions/helpers/trade': mockTrade,
		'../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
		'../../../modules/my-positions/actions/load-account-trades': mockLoadAccountTrades,
		'../../transactions/actions/update-existing-transaction': mockUpdateExisitngTransaction,
		'../../transactions/actions/add-ask-transaction': mockAddAskTransaction,
		'../../transactions/actions/add-short-sell-transaction': mockAddShortSellTransaction,
		'../../transactions/actions/add-short-ask-transaction': mockAddShortAskTransaction
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
		// reset the trade/getParticipantSharesPurchased functions to prep for the next type of market tests...
		if (mockTrade.trade.callCount === 5)
			mockTrade.trade.reset();
		if (mockAugur.augur.getParticipantSharesPurchased.callCount === 4)
			mockAugur.augur.getParticipantSharesPurchased.reset();
	});

	it('should process a sell order for a binary market where all shares are sold', () => {
		store.dispatch(action.processSell('trans1', '0x000000000000000000000000000000000binary1', '2', '10', '0.5', '-10.01', '0.01', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'selling 10 shares for -1.0010 ETH (estimated)/share',
					totalReturn: {
						value: -10.01,
						formattedValue: -10.01,
						formatted: '-10.0100',
						roundedValue: -10.01,
						rounded: '-10.0100',
						minimized: '-10.01',
						denomination: ' ETH (estimated)',
						full: '-10.0100 ETH (estimated)'
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
					status: 'success sell',
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
						value: 0.02791268,
						formattedValue: 0.0279,
						formatted: '0.0279',
						roundedValue: 0.0279,
						rounded: '0.0279',
						minimized: '0.0279',
						denomination: ' real ETH',
						full: '0.0279 real ETH'
					},
					message: 'sold 10 of 10 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 10,
						formattedValue: 10,
						formatted: '10.0000',
						roundedValue: 10,
						rounded: '10.0000',
						minimized: '10',
						denomination: ' ETH',
						full: '10.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'sold 10 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 10,
						formattedValue: 10,
						formatted: '10.0000',
						roundedValue: 10,
						rounded: '10.0000',
						minimized: '10',
						denomination: ' ETH',
						full: '10.0000 ETH'
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
				transactionID: 'trans1',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions and perform the expected calculations`);
	});

	it('should process a sell order for a binary market where only some shares are filled, ask for the rest', () => {
		store.dispatch(action.processSell('trans1', '0x000000000000000000000000000000000binary1', '2', '20', '0.5', '-20.02', '0.02', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0010 ETH (estimated)/share',
					totalReturn: {
						value: -20.02,
						formattedValue: -20.02,
						formatted: '-20.0200',
						roundedValue: -20.02,
						rounded: '-20.0200',
						minimized: '-20.02',
						denomination: ' ETH (estimated)',
						full: '-20.0200 ETH (estimated)'
					},
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH (estimated)',
						full: '0.0200 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
					},
					message: 'sold 15 of 20 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 15,
						formattedValue: 15,
						formatted: '15.0000',
						roundedValue: 15,
						rounded: '15.0000',
						minimized: '15',
						denomination: ' ETH',
						full: '15.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'sold 15 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 15,
						formattedValue: 15,
						formatted: '15.0000',
						roundedValue: 15,
						rounded: '15.0000',
						minimized: '15',
						denomination: ' ETH',
						full: '15.0000 ETH'
					},
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
				type: 'ask',
				data: {
					marketID: '0x000000000000000000000000000000000binary1',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market',
					outcomeName: 'YES'
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
				},
				noFeePrice: {
					value: 0.5,
					formattedValue: 0.5,
					formatted: '0.5000',
					roundedValue: 0.5,
					rounded: '0.5000',
					minimized: '0.5',
					denomination: ' ETH',
					full: '0.5000 ETH'
				},
				avgPrice: {
					value: -4.004,
					formattedValue: -4.004,
					formatted: '-4.0040',
					roundedValue: -4.004,
					rounded: '-4.0040',
					minimized: '-4.004',
					denomination: ' ETH',
					full: '-4.0040 ETH'
				},
				tradingFees: {
					value: 0.02,
					formattedValue: 0.02,
					formatted: '0.0200',
					roundedValue: 0.02,
					rounded: '0.0200',
					minimized: '0.02',
					denomination: ' ETH',
					full: '0.0200 ETH'
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
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions and perform the expected calculations`);
	});

	it('should process a sell order for a binary market where only 1/4 of the shares are filled, rest to ask and short_ask', () => {
		store.dispatch(action.processSell('trans1', '0x000000000000000000000000000000000binary1', '2', '20', '0.4', '-20.01536', '0.01536', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0008 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 5 of 20 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 5,
						formattedValue: 5,
						formatted: '5.0000',
						roundedValue: 5,
						rounded: '5.0000',
						minimized: '5',
						denomination: ' ETH',
						full: '5.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'sold 5 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 5,
						formattedValue: 5,
						formatted: '5.0000',
						roundedValue: 5,
						rounded: '5.0000',
						minimized: '5',
						denomination: ' ETH',
						full: '5.0000 ETH'
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
				type: 'ask',
				data: {
					marketID: '0x000000000000000000000000000000000binary1',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market',
					outcomeName: 'YES'
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
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
					value: -4.003072,
					formattedValue: -4.0031,
					formatted: '-4.0031',
					roundedValue: -4.0031,
					rounded: '-4.0031',
					minimized: '-4.0031',
					denomination: ' ETH',
					full: '-4.0031 ETH'
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
			}, {
				type: 'short_ask',
				data: {
					marketID: '0x000000000000000000000000000000000binary1',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market',
					outcomeName: 'YES'
				},
				numShares: {
					value: 10,
					formattedValue: 10,
					formatted: '10',
					roundedValue: 10,
					rounded: '10.00',
					minimized: '10',
					denomination: ' shares',
					full: '10 shares'
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
					value: -2.001536,
					formattedValue: -2.0015,
					formatted: '-2.0015',
					roundedValue: -2.0015,
					rounded: '-2.0015',
					minimized: '-2.0015',
					denomination: ' ETH',
					full: '-2.0015 ETH'
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
			}, {
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions and perform the expected calculations`);
	});

	it('should process a sell order for a binary market where no shares are filled, short_ask for all', () => {
		store.dispatch(action.processSell('trans1', '0x000000000000000000000000000000000binary1', '2', '20', '0.5', '-20.02', '0.02', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0010 ETH (estimated)/share',
					totalReturn: {
						value: -20.02,
						formattedValue: -20.02,
						formatted: '-20.0200',
						roundedValue: -20.02,
						rounded: '-20.0200',
						minimized: '-20.02',
						denomination: ' ETH (estimated)',
						full: '-20.0200 ETH (estimated)'
					},
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH (estimated)',
						full: '0.0200 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					},
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
					marketID: '0x000000000000000000000000000000000binary1',
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
					value: 0.5,
					formattedValue: 0.5,
					formatted: '0.5000',
					roundedValue: 0.5,
					rounded: '0.5000',
					minimized: '0.5',
					denomination: ' ETH',
					full: '0.5000 ETH'
				},
				avgPrice: {
					value: -1.001,
					formattedValue: -1.001,
					formatted: '-1.0010',
					roundedValue: -1.001,
					rounded: '-1.0010',
					minimized: '-1.001',
					denomination: ' ETH',
					full: '-1.0010 ETH'
				},
				tradingFees: {
					value: 0.02,
					formattedValue: 0.02,
					formatted: '0.0200',
					roundedValue: 0.02,
					rounded: '0.0200',
					minimized: '0.02',
					denomination: ' ETH',
					full: '0.0200 ETH'
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
			{ type: 'LOAD_BIDS_ASKS' },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions and perform the expected calculations`);
	});

	it('should process a sell order for a binary market where no shares are filled, short_sell for all', () => {
		store.dispatch(action.processSell('trans1', '0x000000000000000000000000000000000binary1', '2', '20', '0.4', '-20.01536', '0.01536', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0008 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
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
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: true },
			{
				type: 'short_sell',
				data: {
					marketID: '0x000000000000000000000000000000000binary1',
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
					value: -1.000768,
					formattedValue: -1.0008,
					formatted: '-1.0008',
					roundedValue: -1.0008,
					rounded: '-1.0008',
					minimized: '-1.0008',
					denomination: ' ETH',
					full: '-1.0008 ETH'
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
			{ type: 'LOAD_BIDS_ASKS' },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans1',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000binary1'
			}
		], `Didn't produce the expected actions and perform the expected calculations`);
	});

	it('should process a sell order for a categorical market where all shares are sold', () => {
		store.dispatch(action.processSell('trans2', '0x0000000000000000000000000000categorical1', '1', '10', '0.5', '-10.004999999999999995', '0.004999999999999995', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'selling 10 shares for -1.0005 ETH (estimated)/share',
					totalReturn: {
						value: -10.005,
						formattedValue: -10.005,
						formatted: '-10.0050',
						roundedValue: -10.005,
						rounded: '-10.0050',
						minimized: '-10.005',
						denomination: ' ETH (estimated)',
						full: '-10.0050 ETH (estimated)'
					},
					tradingFees: {
						value: 0.004999999999999995,
						formattedValue: 0.005,
						formatted: '0.0050',
						roundedValue: 0.005,
						rounded: '0.0050',
						minimized: '0.005',
						denomination: ' ETH (estimated)',
						full: '0.0050 ETH (estimated)'
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
			},{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.004999999999999995,
						formattedValue: 0.005,
						formatted: '0.0050',
						roundedValue: 0.005,
						rounded: '0.0050',
						minimized: '0.005',
						denomination: ' ETH',
						full: '0.0050 ETH'
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
					},
					message: 'sold 10 of 10 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 10,
						formattedValue: 10,
						formatted: '10.0000',
						roundedValue: 10,
						rounded: '10.0000',
						minimized: '10',
						denomination: ' ETH',
						full: '10.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'sold 10 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 10,
						formattedValue: 10,
						formatted: '10.0000',
						roundedValue: 10,
						rounded: '10.0000',
						minimized: '10',
						denomination: ' ETH',
						full: '10.0000 ETH'
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
				transactionID: 'trans2',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x0000000000000000000000000000categorical1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a categorical market where only some shares are filled, ask for the rest.', () => {
		store.dispatch(action.processSell('trans2', '0x0000000000000000000000000000categorical1', '1', '20', '0.5', '-20.00999999999999999', '0.00999999999999999', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0005 ETH (estimated)/share',
					totalReturn: {
						value: -20.01,
						formattedValue: -20.01,
						formatted: '-20.0100',
						roundedValue: -20.01,
						rounded: '-20.0100',
						minimized: '-20.01',
						denomination: ' ETH (estimated)',
						full: '-20.0100 ETH (estimated)'
					},
					tradingFees: {
						value: 0.00999999999999999,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH (estimated)',
						full: '0.0100 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.00999999999999999,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH',
						full: '0.0100 ETH'
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
					},
					message: 'sold 15 of 20 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 15,
						formattedValue: 15,
						formatted: '15.0000',
						roundedValue: 15,
						rounded: '15.0000',
						minimized: '15',
						denomination: ' ETH',
						full: '15.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: { status: 'failed', message: 'this error is a test.' }
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'sold 15 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 15,
						formattedValue: 15,
						formatted: '15.0000',
						roundedValue: 15,
						rounded: '15.0000',
						minimized: '15',
						denomination: ' ETH',
						full: '15.0000 ETH'
					},
					tradingFees: {
						value: 0.00999999999999999,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH',
						full: '0.0100 ETH'
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
				type: 'ask',
				data: {
					marketID: '0x0000000000000000000000000000categorical1',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market',
					outcomeName: 'Democratic'
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
				},
				noFeePrice: {
					value: 0.5,
					formattedValue: 0.5,
					formatted: '0.5000',
					roundedValue: 0.5,
					rounded: '0.5000',
					minimized: '0.5',
					denomination: ' ETH',
					full: '0.5000 ETH'
				},
				avgPrice: {
					value: -4.002,
					formattedValue: -4.002,
					formatted: '-4.0020',
					roundedValue: -4.002,
					rounded: '-4.0020',
					minimized: '-4.002',
					denomination: ' ETH',
					full: '-4.0020 ETH'
				},
				tradingFees: {
					value: 0.00999999999999999,
					formattedValue: 0.01,
					formatted: '0.0100',
					roundedValue: 0.01,
					rounded: '0.0100',
					minimized: '0.01',
					denomination: ' ETH',
					full: '0.0100 ETH'
				},
				feePercent: {
					value: 0.09980039920159671,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
			}, {
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x0000000000000000000000000000categorical1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a categorical market where only 1/4 of the shares are filled, rest to ask and short_ask', () => {
		store.dispatch(action.processSell('trans2', '0x0000000000000000000000000000categorical1', '1', '20', '0.4', '-20.007679999999999992', '0.007679999999999992', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0004 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 5 of 20 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 5,
						formattedValue: 5,
						formatted: '5.0000',
						roundedValue: 5,
						rounded: '5.0000',
						minimized: '5',
						denomination: ' ETH',
						full: '5.0000 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'failed', message: 'this error is a test.' } },
		  { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'sold 5 shares for 1.0000 ETH/share',
					totalReturn: {
						value: 5,
						formattedValue: 5,
						formatted: '5.0000',
						roundedValue: 5,
						rounded: '5.0000',
						minimized: '5',
						denomination: ' ETH',
						full: '5.0000 ETH'
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
			}, {
				type: 'ask',
				data: {
					marketID: '0x0000000000000000000000000000categorical1',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market',
					outcomeName: 'Democratic'
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
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
					value: -4.001536,
					formattedValue: -4.0015,
					formatted: '-4.0015',
					roundedValue: -4.0015,
					rounded: '-4.0015',
					minimized: '-4.0015',
					denomination: ' ETH',
					full: '-4.0015 ETH'
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
				feePercent: {
					value: 0.09980039920159671,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
			}, {
				type: 'short_ask',
				data: {
					marketID: '0x0000000000000000000000000000categorical1',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market',
					outcomeName: 'Democratic'
				},
				numShares: {
					value: 10,
					formattedValue: 10,
					formatted: '10',
					roundedValue: 10,
					rounded: '10.00',
					minimized: '10',
					denomination: ' shares',
					full: '10 shares'
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
					value: -2.000768,
					formattedValue: -2.0008,
					formatted: '-2.0008',
					roundedValue: -2.0008,
					rounded: '-2.0008',
					minimized: '-2.0008',
					denomination: ' ETH',
					full: '-2.0008 ETH'
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
				feePercent: {
					value: 0.09980039920159671,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
		  {
				type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'success' }
			},
		  { type: 'LOAD_ACCOUNT_TRADES',
		    marketID: '0x0000000000000000000000000000categorical1'
			}
		], `Didn't produce the expected actions or calculations`);
	});

	it('should process a sell order for a categorical market where no shares are filled, short_ask for all', () => {
		store.dispatch(action.processSell('trans2', '0x0000000000000000000000000000categorical1', '1', '20', '0.5', '-20.00999999999999999', '0.00999999999999999', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0005 ETH (estimated)/share',
					totalReturn: {
						value: -20.01,
						formattedValue: -20.01,
						formatted: '-20.0100',
						roundedValue: -20.01,
						rounded: '-20.0100',
						minimized: '-20.01',
						denomination: ' ETH (estimated)',
						full: '-20.0100 ETH (estimated)'
					},
					tradingFees: {
						value: 0.00999999999999999,
						formattedValue: 0.01,
						formatted: '0.0100',
						roundedValue: 0.01,
						rounded: '0.0100',
						minimized: '0.01',
						denomination: ' ETH (estimated)',
						full: '0.0100 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'failed', message: 'this error is a test.' } },
		  { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					},
					tradingFees: {
						value: 0.02,
						formattedValue: 0.02,
						formatted: '0.0200',
						roundedValue: 0.02,
						rounded: '0.0200',
						minimized: '0.02',
						denomination: ' ETH',
						full: '0.0200 ETH'
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
					marketID: '0x0000000000000000000000000000categorical1',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market',
					outcomeName: 'Democratic'
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
					value: 0.5,
					formattedValue: 0.5,
					formatted: '0.5000',
					roundedValue: 0.5,
					rounded: '0.5000',
					minimized: '0.5',
					denomination: ' ETH',
					full: '0.5000 ETH'
				},
				avgPrice: {
					value: -1.0005,
					formattedValue: -1.0005,
					formatted: '-1.0005',
					roundedValue: -1.0005,
					rounded: '-1.0005',
					minimized: '-1.0005',
					denomination: ' ETH',
					full: '-1.0005 ETH'
				},
				tradingFees: {
					value: 0.00999999999999999,
					formattedValue: 0.01,
					formatted: '0.0100',
					roundedValue: 0.01,
					rounded: '0.0100',
					minimized: '0.01',
					denomination: ' ETH',
					full: '0.0100 ETH'
				},
				feePercent: {
					value: 0.09980039920159671,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
			{ type: 'LOAD_BIDS_ASKS' },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: { status: 'success' } },
			{
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x0000000000000000000000000000categorical1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a categorical market where no shares are filled, short_sell for all', () => {
		store.dispatch(action.processSell('trans2', '0x0000000000000000000000000000categorical1', '1', '20', '0.4', '-20.007679999999999992', '0.007679999999999992', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.0004 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: { status: 'failed', message: 'this error is a test.' } },
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans2',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
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
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: true },
		  {
				type: 'short_sell',
				data: {
					marketID: '0x0000000000000000000000000000categorical1',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market',
					outcomeName: 'Democratic'
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
					value: -1.000384,
					formattedValue: -1.0004,
					formatted: '-1.0004',
					roundedValue: -1.0004,
					rounded: '-1.0004',
					minimized: '-1.0004',
					denomination: ' ETH',
					full: '-1.0004 ETH'
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
				feePercent: {
					value: 0.09980039920159671,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
		  { type: 'LOAD_BIDS_ASKS' },
		  { type: 'UPDATE_EXISTING_TRANSACTION',
		    transactionID: 'trans2',
		    data: { status: 'success' } },
		  {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x0000000000000000000000000000categorical1'
			}
		], `Didn't produce the expected actions or calculations`);
	});

	it('should process a sell order for a scalar market where all shares are sold', () => {
		store.dispatch(action.processSell('trans3', '0x000000000000000000000000000000000scalar1', '1', '10', '55', '-15.36982248520710025', '5.36982248520710025', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'selling 10 shares for -1.5370 ETH (estimated)/share',
					totalReturn: {
						value: -15.3698224852071,
						formattedValue: -15.3698,
						formatted: '-15.3698',
						roundedValue: -15.3698,
						rounded: '-15.3698',
						minimized: '-15.3698',
						denomination: ' ETH (estimated)',
						full: '-15.3698 ETH (estimated)'
					},
					tradingFees: {
						value: 5.3698224852071,
						formattedValue: 5.3698,
						formatted: '5.3698',
						roundedValue: 5.3698,
						rounded: '5.3698',
						minimized: '5.3698',
						denomination: ' ETH (estimated)',
						full: '5.3698 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 5.3698224852071,
						formattedValue: 5.3698,
						formatted: '5.3698',
						roundedValue: 5.3698,
						rounded: '5.3698',
						minimized: '5.3698',
						denomination: ' ETH',
						full: '5.3698 ETH'
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
					},
					message: 'sold 10 of 10 shares for 0.6506 ETH/share',
					totalReturn: {
						value: 15.3698224852071,
						formattedValue: 15.3698,
						formatted: '15.3698',
						roundedValue: 15.3698,
						rounded: '15.3698',
						minimized: '15.3698',
						denomination: ' ETH',
						full: '15.3698 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false},
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'failed',
					message: 'this error is a test.'
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'sold 10 shares for 1.5370 ETH/share',
					totalReturn: {
						value: 15.3698224852071,
						formattedValue: 15.3698,
						formatted: '15.3698',
						roundedValue: 15.3698,
						rounded: '15.3698',
						minimized: '15.3698',
						denomination: ' ETH',
						full: '15.3698 ETH'
					},
					tradingFees: {
						value: 5.3698224852071,
						formattedValue: 5.3698,
						formatted: '5.3698',
						roundedValue: 5.3698,
						rounded: '5.3698',
						minimized: '5.3698',
						denomination: ' ETH',
						full: '5.3698 ETH'
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
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000scalar1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a scalar market where only some shares are filled, ask for the rest.', () => {
		store.dispatch(action.processSell('trans3', '0x000000000000000000000000000000000scalar1', '1', '20', '55', '-30.7396449704142005', '10.7396449704142005', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.5370 ETH (estimated)/share',
					totalReturn: {
						value: -30.7396449704142,
						formattedValue: -30.7396,
						formatted: '-30.7396',
						roundedValue: -30.7396,
						rounded: '-30.7396',
						minimized: '-30.7396',
						denomination: ' ETH (estimated)',
						full: '-30.7396 ETH (estimated)'
					},
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH (estimated)',
						full: '10.7396 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH',
						full: '10.7396 ETH'
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
					},
					message: 'sold 15 of 20 shares for 0.5828 ETH/share',
					totalReturn: {
						value: 25.7396449704142,
						formattedValue: 25.7396,
						formatted: '25.7396',
						roundedValue: 25.7396,
						rounded: '25.7396',
						minimized: '25.7396',
						denomination: ' ETH',
						full: '25.7396 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
 			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'failed',
					message: 'this error is a test.'
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
 			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'sold 15 shares for 1.7160 ETH/share',
					totalReturn: {
						value: 25.7396449704142,
						formattedValue: 25.7396,
						formatted: '25.7396',
						roundedValue: 25.7396,
						rounded: '25.7396',
						minimized: '25.7396',
						denomination: ' ETH',
						full: '25.7396 ETH'
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
				type: 'ask',
				data: {
					marketID: '0x000000000000000000000000000000000scalar1',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market',
					outcomeName: ''
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
				},
				noFeePrice: {
					value: 55,
					formattedValue: 55,
					formatted: '55.0000',
					roundedValue: 55,
					rounded: '55.0000',
					minimized: '55',
					denomination: ' ETH',
					full: '55.0000 ETH'
				},
				avgPrice: {
					value: -6.14792899408284,
					formattedValue: -6.1479,
					formatted: '-6.1479',
					roundedValue: -6.1479,
					rounded: '-6.1479',
					minimized: '-6.1479',
					denomination: ' ETH',
					full: '-6.1479 ETH'
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
			}, {
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000scalar1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a scalar market where only 1/4 of the shares are filled, rest to ask and short_ask', () => {
		store.dispatch(action.processSell('trans3', '0x000000000000000000000000000000000scalar1', '1', '20', '40', '-26.8165680473372776', '6.8165680473372776', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.3408 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 5 of 20 shares for 0.4231 ETH/share',
					totalReturn: {
						value: 11.816568047337277,
						formattedValue: 11.8166,
						formatted: '11.8166',
						roundedValue: 11.8166,
						rounded: '11.8166',
						minimized: '11.8166',
						denomination: ' ETH',
						full: '11.8166 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'failed', message: 'this error is a test.' } },
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'sold 5 shares for 2.3633 ETH/share',
					totalReturn: {
						value: 11.816568047337277,
						formattedValue: 11.8166,
						formatted: '11.8166',
						roundedValue: 11.8166,
						rounded: '11.8166',
						minimized: '11.8166',
						denomination: ' ETH',
						full: '11.8166 ETH'
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
			}, {
				type: 'ask',
				data: {
					marketID: '0x000000000000000000000000000000000scalar1',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market',
					outcomeName: ''
				},
				numShares: {
					value: 5,
					formattedValue: 5,
					formatted: '5',
					roundedValue: 5,
					rounded: '5.00',
					minimized: '5',
					denomination: ' shares',
					full: '5 shares'
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
					value: -5.363313609467456,
					formattedValue: -5.3633,
					formatted: '-5.3633',
					roundedValue: -5.3633,
					rounded: '-5.3633',
					minimized: '-5.3633',
					denomination: ' ETH',
					full: '-5.3633 ETH'
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
			}, {
				type: 'short_ask',
				data: {
					marketID: '0x000000000000000000000000000000000scalar1',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market',
					outcomeName: ''
				},
				numShares: {
					value: 10,
					formattedValue: 10,
					formatted: '10',
					roundedValue: 10,
					rounded: '10.00',
					minimized: '10',
					denomination: ' shares',
					full: '10 shares'
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
					value: -2.681656804733728,
					formattedValue: -2.6817,
					formatted: '-2.6817',
					roundedValue: -2.6817,
					rounded: '-2.6817',
					minimized: '-2.6817',
					denomination: ' ETH',
					full: '-2.6817 ETH'
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
			}, {
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000scalar1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a scalar market where no shares are filled, short_ask for all', () => {
		store.dispatch(action.processSell('trans3', '0x000000000000000000000000000000000scalar1', '1', '20', '55', '-30.7396449704142005', '10.7396449704142005', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.5370 ETH (estimated)/share',
					totalReturn: {
						value: -30.7396449704142,
						formattedValue: -30.7396,
						formatted: '-30.7396',
						roundedValue: -30.7396,
						rounded: '-30.7396',
						minimized: '-30.7396',
						denomination: ' ETH (estimated)',
						full: '-30.7396 ETH (estimated)'
					},
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH (estimated)',
						full: '10.7396 ETH (estimated)'
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
					status: 'success sell',
					hash: 'testhash',
					timestamp: 1500000000,
					tradingFees: {
						value: 10.7396449704142,
						formattedValue: 10.7396,
						formatted: '10.7396',
						roundedValue: 10.7396,
						rounded: '10.7396',
						minimized: '10.7396',
						denomination: ' ETH',
						full: '10.7396 ETH'
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'failed', message: 'this error is a test.' } },
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
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
					marketID: '0x000000000000000000000000000000000scalar1',
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
					value: 55,
					formattedValue: 55,
					formatted: '55.0000',
					roundedValue: 55,
					rounded: '55.0000',
					minimized: '55',
					denomination: ' ETH',
					full: '55.0000 ETH'
				},
				avgPrice: {
					value: -1.53698224852071,
					formattedValue: -1.537,
					formatted: '-1.5370',
					roundedValue: -1.537,
					rounded: '-1.5370',
					minimized: '-1.537',
					denomination: ' ETH',
					full: '-1.5370 ETH'
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
			{ type: 'LOAD_BIDS_ASKS' },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000scalar1'
			}
		], `Didn't produce the expected actions and calculations`);
	});

	it('should process a sell order for a scalar market where no shares are filled, short_sell for all', () => {
		store.dispatch(action.processSell('trans3', '0x000000000000000000000000000000000scalar1', '1', '20', '40', '-26.8165680473372776', '6.8165680473372776', '0.02791268'));
		assert.deepEqual(store.getActions(), [
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'starting...',
					message: 'selling 20 shares for -1.3408 ETH (estimated)/share',
					totalReturn: {
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
					status: 'success sell',
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
					},
					message: 'sold 0 of 20 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
					}
				}
			},
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{ type: 'UPDATE_EXISTING_TRANSACTION',
			  transactionID: 'trans3',
			  data: { status: 'failed', message: 'this error is a test.' } },
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: false },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: {
					status: 'updating position',
					message: 'sold 0 shares for 0 ETH/share',
					totalReturn: {
						value: 0,
						formattedValue: 0,
						formatted: '0',
						roundedValue: 0,
						rounded: '0.0000',
						minimized: '0',
						denomination: ' ETH',
						full: '0 ETH'
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
			{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: true },
			{
				type: 'short_sell',
				data: {
					marketID: '0x000000000000000000000000000000000scalar1',
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
					value: -1.340828402366864,
					formattedValue: -1.3408,
					formatted: '-1.3408',
					roundedValue: -1.3408,
					rounded: '-1.3408',
					minimized: '-1.3408',
					denomination: ' ETH',
					full: '-1.3408 ETH'
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
			{ type: 'LOAD_BIDS_ASKS' },
			{
				type: 'UPDATE_EXISTING_TRANSACTION',
				transactionID: 'trans3',
				data: { status: 'success' }
			}, {
				type: 'LOAD_ACCOUNT_TRADES',
				marketID: '0x000000000000000000000000000000000scalar1'
			}
		], `Didn't produce the expected actions and calculations`);
	});
});
