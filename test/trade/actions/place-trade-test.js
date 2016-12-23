import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { BUY, tradeTestState, tradeConstOrderBooks, stubAddBidTransaction, stubAddTradeTransaction, stubAddAskTransaction, stubAddShortAskTransaction, stubAddShortSellTransaction, stubCalculateBuyTradeIDs, stubCalculateSellTradeIDs } from 'test/trade/constants';

describe(`modules/trade/actions/place-trade.js`, () => {
	proxyquire.noPreserveCache();
	const { state, mockStore } = mocks.default;
	const testState = Object.assign({}, state, tradeTestState);
	testState.orderBooks = tradeConstOrderBooks;
	testState.tradesInProgress = {
		testBinaryMarketID: {
			2: {
				side: BUY,
				numShares: '10',
				limitPrice: '0.5',
				totalFee: '0.01',
				totalCost: '5.01',
				tradeActions: [{
					action: 'BID',
					shares: '10',
					gasEth: '0.01450404',
					feeEth: '0.01',
					feePercent: '0.2',
					costEth: '5.01',
					avgPrice: '0.501',
					noFeePrice: '0.5'
				}],
				tradingFeesEth: '0.01',
				gasFeesRealEth: '0.01450404',
				feePercent: '0.199203187250996016'
			}
		},
		testCategoricalMarketID: {
			1: {
				side: BUY,
				numShares: '10',
				limitPrice: '0.5',
				totalFee: '0.004999999999999995',
				totalCost: '5.004999999999999995',
				tradeActions: [{
					action: 'BID',
					shares: '10',
					gasEth: '0.01450404',
					feeEth: '0.004999999999999995',
					feePercent: '0.0999999999999999',
					costEth: '5.004999999999999995',
					avgPrice: '0.500499999999999999',
					noFeePrice: '0.5'
				}],
				tradingFeesEth: '0.004999999999999995',
				gasFeesRealEth: '0.01450404',
				feePercent: '0.099800399201596707'
			}
		},
		testScalarMarketID: {
			1: {
				side: BUY,
				numShares: '10',
				limitPrice: '55',
				totalFee: '5.36982248520710025',
				totalCost: '555.36982248520710025',
				tradeActions: [
					{
						action: 'BID',
						shares: '10',
						gasEth: '0.01450404',
						feeEth: '5.36982248520710025',
						feePercent: '0.9763313609467455',
						costEth: '555.36982248520710025',
						avgPrice: '55.536982248520710025',
						noFeePrice: '55'
					}
				],
				tradingFeesEth: '5.36982248520710025',
				gasFeesRealEth: '0.01450404',
				feePercent: '0.95763203714451532'
			}
		}
	};
	const store = mockStore(testState);
	const mockSelectMarket = { selectMarket: () => {} };
	sinon.stub(mockSelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
	const mockAddBidTransaction = { addBidTransaction: () => {} };
	sinon.stub(mockAddBidTransaction, 'addBidTransaction', stubAddBidTransaction);

	const mockAddTradeTransaction = { addTradeTransaction: () => {} };
	sinon.stub(mockAddTradeTransaction, 'addTradeTransaction', stubAddTradeTransaction);

	const mockAddAskTransaction = { addAskTransaction: () => {} };
	sinon.stub(mockAddAskTransaction, 'addAskTransaction', stubAddAskTransaction);

	const mockAddShortAskTransaction = { addShortAskTransaction: () => {} };
	sinon.stub(mockAddShortAskTransaction, 'addShortAskTransaction', stubAddShortAskTransaction);

	const mockAddShortSellTransaction = { addShortSellTransaction: () => {} };
	sinon.stub(mockAddShortSellTransaction, 'addShortSellTransaction', stubAddShortSellTransaction);

	const mockCalculateTradeIDs = {
		calculateBuyTradeIDs: () => {},
		calculateSellTradeIDs: () => {}
	};
	sinon.stub(mockCalculateTradeIDs, 'calculateBuyTradeIDs', stubCalculateBuyTradeIDs);
	sinon.stub(mockCalculateTradeIDs, 'calculateSellTradeIDs', stubCalculateSellTradeIDs);

	const mockAugur = { augur: { getParticipantSharesPurchased: () => {} } };
	sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
		console.log('callcount:', mockAugur.augur.getParticipantSharesPurchased.callCount);
		switch (mockAugur.augur.getParticipantSharesPurchased.callCount) {
			case 2:
				cb('5');
				break;
			case 4:
			case 5:
				cb('0');
				break;
			default:
				cb('10');
				break;
		}
	});

	const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
		'../../../services/augurjs': mockAugur,
		'../../market/selectors/market': mockSelectMarket,
		'../../transactions/actions/add-trade-transaction': mockAddTradeTransaction,
		'../../transactions/actions/add-bid-transaction': mockAddBidTransaction,
		'../../transactions/actions/add-ask-transaction': mockAddAskTransaction,
		'../../transactions/actions/add-short-ask-transaction': mockAddShortAskTransaction,
		'../../transactions/actions/add-short-sell-transaction': mockAddShortSellTransaction,
		'../../trade/actions/helpers/calculate-trade-ids': mockCalculateTradeIDs
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
		if (mockAugur.augur.getParticipantSharesPurchased.callCount === 5) mockAugur.augur.getParticipantSharesPurchased.reset();
	});

	describe('Binary Market Place Trade Tests', () => {
		it('should place a BUY trade for a binary market', () => {
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{ type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: true }, {
				type: 'buy',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 0.501,
					formattedValue: 0.501,
					formatted: '0.5010',
					roundedValue: 0.501,
					rounded: '0.5010',
					minimized: '0.501',
					denomination: ' ETH',
					full: '0.5010 ETH'
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
					value: 0.01450404,
					formattedValue: 0.0145,
					formatted: '0.0145',
					roundedValue: 0.0145,
					rounded: '0.0145',
					minimized: '0.0145',
					denomination: ' real ETH',
					full: '0.0145 real ETH'
				}
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected actions and calculations`);
		});

		it('should place a BID trade for a binary market', () => {
			store.getState().tradesInProgress.testBinaryMarketID = {
				2: {
					side: 'buy',
					numShares: '10',
					limitPrice: '0.35',
					totalFee: '0.00637',
					totalCost: '3.50637',
					tradeActions: [{
						action: 'BID',
						shares: '10',
						gasEth: '0.01450404',
						feeEth: '0.00637',
						feePercent: '0.182',
						costEth: '3.50637',
						avgPrice: '0.350637',
						noFeePrice: '0.35'
					}],
					tradingFeesEth: '0.00637',
					gasFeesRealEth: '0.01450404',
					feePercent: '0.18133992268143956'
				}
			};
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{
				type: 'bid',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 0.35,
					formattedValue: 0.35,
					formatted: '0.3500',
					roundedValue: 0.35,
					rounded: '0.3500',
					minimized: '0.35',
					denomination: ' ETH',
					full: '0.3500 ETH'
				},
				avgPrice: {
					value: 0.350637,
					formattedValue: 0.3506,
					formatted: '0.3506',
					roundedValue: 0.3506,
					rounded: '0.3506',
					minimized: '0.3506',
					denomination: ' ETH',
					full: '0.3506 ETH'
				},
				tradingFees: {
					value: 0.00637,
					formattedValue: 0.0064,
					formatted: '0.0064',
					roundedValue: 0.0064,
					rounded: '0.0064',
					minimized: '0.0064',
					denomination: ' ETH',
					full: '0.0064 ETH'
				},
				feePercent: {
					value: 0.18133992268143956,
					formattedValue: 0.2,
					formatted: '0.2',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.2',
					denomination: '%',
					full: '0.2%'
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
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected actions or calculations`);
		});

		it('should place a ASK trade for a binary market', () => {
			store.getState().tradesInProgress.testBinaryMarketID = {
				2: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.5',
					totalFee: '0.01',
					totalCost: '-10.01',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.01',
						feePercent: '0.2',
						costEth: '-10.01',
						avgPrice: '1.001',
						noFeePrice: '0.5'
					}],
					tradingFeesEth: '0.01',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.099800399201596806'
				}
			};
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 1.001,
					formattedValue: 1.001,
					formatted: '1.0010',
					roundedValue: 1.001,
					rounded: '1.0010',
					minimized: '1.001',
					denomination: ' ETH',
					full: '1.0010 ETH'
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
				feePercent: {
					value: 0.0998003992015968,
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
			{ type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected Actions or Calculations`);
		});

		it('should place a ASK and SHORT_ASK trade for a binary market', () => {
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			console.log(store.getActions());
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 2.002,
					formattedValue: 2.002,
					formatted: '2.0020',
					roundedValue: 2.002,
					rounded: '2.0020',
					minimized: '2.002',
					denomination: ' ETH',
					full: '2.0020 ETH'
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
				feePercent: {
					value: 0.0998003992015968,
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
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 2.002,
					formattedValue: 2.002,
					formatted: '2.0020',
					roundedValue: 2.002,
					rounded: '2.0020',
					minimized: '2.002',
					denomination: ' ETH',
					full: '2.0020 ETH'
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
				feePercent: {
					value: 0.0998003992015968,
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
			{ type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID' },
			], `Didn't produce the expected Actions or Calculations`);
		});

		it('should place a SELL trade for a binary market', () => {
			store.getState().tradesInProgress.testBinaryMarketID = {
				2: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.45',
					totalFee: '0.00891',
					totalCost: '-10.00891',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.00891',
						feePercent: '0.198',
						costEth: '-10.00891',
						avgPrice: '1.000891',
						noFeePrice: '0.45'
					}],
					tradingFeesEth: '0.00891',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.088941506235887648' }
			};
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'sell',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 0.45,
					formattedValue: 0.45,
					formatted: '0.4500',
					roundedValue: 0.45,
					rounded: '0.4500',
					minimized: '0.45',
					denomination: ' ETH',
					full: '0.4500 ETH'
				},
				avgPrice: {
					value: 1.000891,
					formattedValue: 1.0009,
					formatted: '1.0009',
					roundedValue: 1.0009,
					rounded: '1.0009',
					minimized: '1.0009',
					denomination: ' ETH',
					full: '1.0009 ETH'
				},
				tradingFees: {
					value: 0.00891,
					formattedValue: 0.0089,
					formatted: '0.0089',
					roundedValue: 0.0089,
					rounded: '0.0089',
					minimized: '0.0089',
					denomination: ' ETH',
					full: '0.0089 ETH'
				},
				feePercent: {
					value: 0.08894150623588765,
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected actions or calculations`);
		});

		it('should place a SHORT_ASK trade for a binary market', () => {
			store.getState().tradesInProgress.testBinaryMarketID = {
				2: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.5',
					totalFee: '0.01',
					totalCost: '-10.01',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.01',
						feePercent: '0.2',
						costEth: '-10.01',
						avgPrice: '1.001',
						noFeePrice: '0.5'
					}],
					tradingFeesEth: '0.01',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.099800399201596806' }
			};
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{
				type: 'short_ask',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 1.001,
					formattedValue: 1.001,
					formatted: '1.0010',
					roundedValue: 1.001,
					rounded: '1.0010',
					minimized: '1.001',
					denomination: ' ETH',
					full: '1.0010 ETH'
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
				feePercent: {
					value: 0.0998003992015968,
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected actions and calculations`);
		});

		it('should place a SHORT_SELL trade for a binary market', () => {
			store.getState().tradesInProgress.testBinaryMarketID = {
				2: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.45',
					totalFee: '0.00891',
					totalCost: '-10.00891',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.00891',
						feePercent: '0.198',
						costEth: '-10.00891',
						avgPrice: '1.000891',
						noFeePrice: '0.45'
					}],
					tradingFeesEth: '0.00891',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.088941506235887648'
				}
			};
			store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'short_sell',
				data: {
					marketID: 'testBinaryMarketID',
					outcomeID: '2',
					marketType: 'binary',
					marketDescription: 'test binary market?',
					outcomeName: 'Yes'
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
					value: 0.45,
					formattedValue: 0.45,
					formatted: '0.4500',
					roundedValue: 0.45,
					rounded: '0.4500',
					minimized: '0.45',
					denomination: ' ETH',
					full: '0.4500 ETH'
				},
				avgPrice: {
					value: 1.000891,
					formattedValue: 1.0009,
					formatted: '1.0009',
					roundedValue: 1.0009,
					rounded: '1.0009',
					minimized: '1.0009',
					denomination: ' ETH',
					full: '1.0009 ETH'
				},
				tradingFees: {
					value: 0.00891,
					formattedValue: 0.0089,
					formatted: '0.0089',
					roundedValue: 0.0089,
					rounded: '0.0089',
					minimized: '0.0089',
					denomination: ' ETH',
					full: '0.0089 ETH'
				},
				feePercent: {
					value: 0.08894150623588765,
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testBinaryMarketID'
			}], `Didn't produce the expected Actions or Calculations`);
		});
	});

	describe('Categorical Market Place Trade Tests', () => {
		it('should place a BUY trade for a categorical market', () => {
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'buy',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 0.5005,
					formattedValue: 0.5005,
					formatted: '0.5005',
					roundedValue: 0.5005,
					rounded: '0.5005',
					minimized: '0.5005',
					denomination: ' ETH',
					full: '0.5005 ETH'
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
					value: 0.01450404,
					formattedValue: 0.0145,
					formatted: '0.0145',
					roundedValue: 0.0145,
					rounded: '0.0145',
					minimized: '0.0145',
					denomination: ' real ETH',
					full: '0.0145 real ETH'
				}
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], `Didn't produce the expected Actions or Calculations`);
		});

		it('should place a BID trade for a categorical market', () => {
			store.getState().tradesInProgress.testCategoricalMarketID = {
				1: {
					side: 'buy',
					numShares: '10',
					limitPrice: '0.35',
					totalFee: '0.003184999999999996',
					totalCost: '3.503184999999999996',
					tradeActions: [{
						action: 'BID',
						shares: '10',
						gasEth: '0.01450404',
						feeEth: '0.003184999999999996',
						feePercent: '0.0909999999999999',
						costEth: '3.503184999999999996',
						avgPrice: '0.350318499999999999',
						noFeePrice: '0.35'
					}],
					tradingFeesEth: '0.003184999999999996',
					gasFeesRealEth: '0.01450404',
					feePercent: '0.090834680880796836'
				}
			};
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'bid',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 0.35,
					formattedValue: 0.35,
					formatted: '0.3500',
					roundedValue: 0.35,
					rounded: '0.3500',
					minimized: '0.35',
					denomination: ' ETH',
					full: '0.3500 ETH'
				},
				avgPrice: {
					value: 0.3503185,
					formattedValue: 0.3503,
					formatted: '0.3503',
					roundedValue: 0.3503,
					rounded: '0.3503',
					minimized: '0.3503',
					denomination: ' ETH',
					full: '0.3503 ETH'
				},
				tradingFees: {
					value: 0.003184999999999996,
					formattedValue: 0.0032,
					formatted: '0.0032',
					roundedValue: 0.0032,
					rounded: '0.0032',
					minimized: '0.0032',
					denomination: ' ETH',
					full: '0.0032 ETH'
				},
				feePercent: {
					value: 0.09083468088079684,
					formattedValue: 0.1,
					formatted: '0.1',
					roundedValue: 0,
					rounded: '0',
					minimized: '0.1',
					denomination: '%',
					full: '0.1%'
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
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], "Didn't produce the expected Actions or Calculations");
		});

		it('should place a ASK trade for a categorical market', () => {
			store.getState().tradesInProgress.testCategoricalMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.5',
					totalFee: '0.004999999999999995',
					totalCost: '-10.004999999999999995',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.004999999999999995',
						feePercent: '0.0999999999999999',
						costEth: '-10.004999999999999995',
						avgPrice: '1.000499999999999999',
						noFeePrice: '0.5'
					}],
					tradingFeesEth: '0.004999999999999995',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.0499500499500499'
				}
			};
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 1.0005,
					formattedValue: 1.0005,
					formatted: '1.0005',
					roundedValue: 1.0005,
					rounded: '1.0005',
					minimized: '1.0005',
					denomination: ' ETH',
					full: '1.0005 ETH'
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
				feePercent: {
					value: 0.0499500499500499,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], "Didn't produce the expected Actions or Calculations");
		});

		it('should place a ASK and SHORT_ASK trade for a categorical market', () => {
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 2.001,
					formattedValue: 2.001,
					formatted: '2.0010',
					roundedValue: 2.001,
					rounded: '2.0010',
					minimized: '2.001',
					denomination: ' ETH',
					full: '2.0010 ETH'
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
				feePercent: {
					value: 0.0499500499500499,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 2.001,
					formattedValue: 2.001,
					formatted: '2.0010',
					roundedValue: 2.001,
					rounded: '2.0010',
					minimized: '2.001',
					denomination: ' ETH',
					full: '2.0010 ETH'
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
				feePercent: {
					value: 0.0499500499500499,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], "Didn't produce the expected Actions or Calculations");
		});

		it('should place a SELL trade for a categorical market', () => {
			store.getState().tradesInProgress.testCategoricalMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.45',
					totalFee: '0.004454999999999995',
					totalCost: '-10.004454999999999995',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.004454999999999995',
						feePercent: '0.0989999999999999',
						costEth: '-10.004454999999999995',
						avgPrice: '1.000445499999999999',
						noFeePrice: '0.45'
					}],
					tradingFeesEth: '0.004454999999999995',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.0445103412859142'
				}
			};
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'sell',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 0.45,
					formattedValue: 0.45,
					formatted: '0.4500',
					roundedValue: 0.45,
					rounded: '0.4500',
					minimized: '0.45',
					denomination: ' ETH',
					full: '0.4500 ETH'
				},
				avgPrice: {
					value: 1.0004455,
					formattedValue: 1.0004,
					formatted: '1.0004',
					roundedValue: 1.0004,
					rounded: '1.0004',
					minimized: '1.0004',
					denomination: ' ETH',
					full: '1.0004 ETH'
				},
				tradingFees: {
					value: 0.004454999999999995,
					formattedValue: 0.0045,
					formatted: '0.0045',
					roundedValue: 0.0045,
					rounded: '0.0045',
					minimized: '0.0045',
					denomination: ' ETH',
					full: '0.0045 ETH'
				},
				feePercent: {
					value: 0.0445103412859142,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], `Didn't produce the expected Actions or Calculations`);
		});

		it('should place a SHORT_ASK trade for a categorical market', () => {
			store.getState().tradesInProgress.testCategoricalMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.5',
					totalFee: '0.004999999999999995',
					totalCost: '-10.004999999999999995',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.004999999999999995',
						feePercent: '0.0999999999999999',
						costEth: '-10.004999999999999995',
						avgPrice: '1.000499999999999999',
						noFeePrice: '0.5'
					}],
					tradingFeesEth: '0.004999999999999995',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.0499500499500499'
				}
			};
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'short_ask',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 1.0005,
					formattedValue: 1.0005,
					formatted: '1.0005',
					roundedValue: 1.0005,
					rounded: '1.0005',
					minimized: '1.0005',
					denomination: ' ETH',
					full: '1.0005 ETH'
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
				feePercent: {
					value: 0.0499500499500499,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], `Didn't produce the expected Actions or Calculations`);
		});

		it('should place a SHORT_SELL trade for a categorical market', () => {
			store.getState().tradesInProgress.testCategoricalMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '0.45',
					totalFee: '0.004454999999999995',
					totalCost: '-10.004454999999999995',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '0.004454999999999995',
						feePercent: '0.0989999999999999',
						costEth: '-10.004454999999999995',
						avgPrice: '1.000445499999999999',
						noFeePrice: '0.45'
					}],
					tradingFeesEth: '0.004454999999999995',
					gasFeesRealEth: '0.02791268',
					feePercent: '0.0445103412859142'
				}
			};
			store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'short_sell',
				data: {
					marketID: 'testCategoricalMarketID',
					outcomeID: '1',
					marketType: 'categorical',
					marketDescription: 'test categorical market?',
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
					value: 0.45,
					formattedValue: 0.45,
					formatted: '0.4500',
					roundedValue: 0.45,
					rounded: '0.4500',
					minimized: '0.45',
					denomination: ' ETH',
					full: '0.4500 ETH'
				},
				avgPrice: {
					value: 1.0004455,
					formattedValue: 1.0004,
					formatted: '1.0004',
					roundedValue: 1.0004,
					rounded: '1.0004',
					minimized: '1.0004',
					denomination: ' ETH',
					full: '1.0004 ETH'
				},
				tradingFees: {
					value: 0.004454999999999995,
					formattedValue: 0.0045,
					formatted: '0.0045',
					roundedValue: 0.0045,
					rounded: '0.0045',
					minimized: '0.0045',
					denomination: ' ETH',
					full: '0.0045 ETH'
				},
				feePercent: {
					value: 0.0445103412859142,
					formattedValue: 0,
					formatted: '0.0',
					roundedValue: 0,
					rounded: '0',
					minimized: '0',
					denomination: '%',
					full: '0.0%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testCategoricalMarketID'
			}], "Didn't produce the expected Actions or Calculations");
		});
	});

	describe('Scalar Market Place Trade Tests', () => {
		it('should place a BUY trade for a scalar market', () => {
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'buy',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 55.53698224852071,
					formattedValue: 55.537,
					formatted: '55.5370',
					roundedValue: 55.537,
					rounded: '55.5370',
					minimized: '55.537',
					denomination: ' ETH',
					full: '55.5370 ETH'
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
					value: 0.01450404,
					formattedValue: 0.0145,
					formatted: '0.0145',
					roundedValue: 0.0145,
					rounded: '0.0145',
					minimized: '0.0145',
					denomination: ' real ETH',
					full: '0.0145 real ETH'
				}
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a BID trade for a scalar market', () => {
			store.getState().tradesInProgress.testScalarMarketID = {
				1: {
					side: 'buy',
					numShares: '10',
					limitPrice: '35',
					totalFee: '2.754437869822485',
					totalCost: '352.754437869822485',
					tradeActions: [{
						action: 'BID',
						shares: '10',
						gasEth: '0.01450404',
						feeEth: '2.754437869822485',
						feePercent: '0.78698224852071',
						costEth: '352.754437869822485',
						avgPrice: '35.2754437869822485',
						noFeePrice: '35'
					}],
					tradingFeesEth: '2.754437869822485',
					gasFeesRealEth: '0.01450404',
					feePercent: '0.7747873703833158'
				}
			};
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'bid',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 35,
					formattedValue: 35,
					formatted: '35.0000',
					roundedValue: 35,
					rounded: '35.0000',
					minimized: '35',
					denomination: ' ETH',
					full: '35.0000 ETH'
				},
				avgPrice: {
					value: 35.27544378698225,
					formattedValue: 35.2754,
					formatted: '35.2754',
					roundedValue: 35.2754,
					rounded: '35.2754',
					minimized: '35.2754',
					denomination: ' ETH',
					full: '35.2754 ETH'
				},
				tradingFees: {
					value: 2.754437869822485,
					formattedValue: 2.7544,
					formatted: '2.7544',
					roundedValue: 2.7544,
					rounded: '2.7544',
					minimized: '2.7544',
					denomination: ' ETH',
					full: '2.7544 ETH'
				},
				feePercent: {
					value: 0.7747873703833158,
					formattedValue: 0.8,
					formatted: '0.8',
					roundedValue: 1,
					rounded: '1',
					minimized: '0.8',
					denomination: '%',
					full: '0.8%'
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
			}, {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a ASK trade for a scalar market', () => {
			store.getState().tradesInProgress.testScalarMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '55',
					totalFee: '5.36982248520710025',
					totalCost: '-15.36982248520710025',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '5.36982248520710025',
						feePercent: '0.9763313609467455',
						costEth: '-15.36982248520710025',
						avgPrice: '1.536982248520710025',
						noFeePrice: '55'
					}],
					tradingFeesEth: '5.36982248520710025',
					gasFeesRealEth: '0.02791268',
					feePercent: '25.891583452211126167'
				}
			};
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 1.53698224852071,
					formattedValue: 1.537,
					formatted: '1.5370',
					roundedValue: 1.537,
					rounded: '1.5370',
					minimized: '1.537',
					denomination: ' ETH',
					full: '1.5370 ETH'
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
				feePercent: {
					value: 25.891583452211126,
					formattedValue: 25.9,
					formatted: '25.9',
					roundedValue: 26,
					rounded: '26',
					minimized: '25.9',
					denomination: '%',
					full: '25.9%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a ASK and SHORT_ASK trade for a scalar market', () => {
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'ask',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 3.07396449704142,
					formattedValue: 3.074,
					formatted: '3.0740',
					roundedValue: 3.074,
					rounded: '3.0740',
					minimized: '3.074',
					denomination: ' ETH',
					full: '3.0740 ETH'
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
				feePercent: {
					value: 25.891583452211126,
					formattedValue: 25.9,
					formatted: '25.9',
					roundedValue: 26,
					rounded: '26',
					minimized: '25.9',
					denomination: '%',
					full: '25.9%'
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
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 3.07396449704142,
					formattedValue: 3.074,
					formatted: '3.0740',
					roundedValue: 3.074,
					rounded: '3.0740',
					minimized: '3.074',
					denomination: ' ETH',
					full: '3.0740 ETH'
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
				feePercent: {
					value: 25.891583452211126,
					formattedValue: 25.9,
					formatted: '25.9',
					roundedValue: 26,
					rounded: '26',
					minimized: '25.9',
					denomination: '%',
					full: '25.9%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a SELL trade for a scalar market', () => {
			store.getState().tradesInProgress.testScalarMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '45',
					totalFee: '4.0739644970414199',
					totalCost: '-14.0739644970414199',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '4.0739644970414199',
						feePercent: '0.9053254437869822',
						costEth: '-14.0739644970414199',
						avgPrice: '1.40739644970414199',
						noFeePrice: '45'
					}],
					tradingFeesEth: '4.0739644970414199',
					gasFeesRealEth: '0.02791268',
					feePercent: '22.448646886208020204'
				}
			};
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'sell',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 45,
					formattedValue: 45,
					formatted: '45.0000',
					roundedValue: 45,
					rounded: '45.0000',
					minimized: '45',
					denomination: ' ETH',
					full: '45.0000 ETH'
				},
				avgPrice: {
					value: 1.407396449704142,
					formattedValue: 1.4074,
					formatted: '1.4074',
					roundedValue: 1.4074,
					rounded: '1.4074',
					minimized: '1.4074',
					denomination: ' ETH',
					full: '1.4074 ETH'
				},
				tradingFees: {
					value: 4.07396449704142,
					formattedValue: 4.074,
					formatted: '4.0740',
					roundedValue: 4.074,
					rounded: '4.0740',
					minimized: '4.074',
					denomination: ' ETH',
					full: '4.0740 ETH'
				},
				feePercent: {
					value: 22.44864688620802,
					formattedValue: 22.4,
					formatted: '22.4',
					roundedValue: 22,
					rounded: '22',
					minimized: '22.4',
					denomination: '%',
					full: '22.4%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a SHORT_ASK trade for a scalar market', () => {
			store.getState().tradesInProgress.testScalarMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '55',
					totalFee: '5.36982248520710025',
					totalCost: '-15.36982248520710025',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '5.36982248520710025',
						feePercent: '0.9763313609467455',
						costEth: '-15.36982248520710025',
						avgPrice: '1.536982248520710025',
						noFeePrice: '55'
					}],
					tradingFeesEth: '5.36982248520710025',
					gasFeesRealEth: '0.02791268',
					feePercent: '25.891583452211126167'
				}
			};
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'short_ask',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 1.53698224852071,
					formattedValue: 1.537,
					formatted: '1.5370',
					roundedValue: 1.537,
					rounded: '1.5370',
					minimized: '1.537',
					denomination: ' ETH',
					full: '1.5370 ETH'
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
				feePercent: {
					value: 25.891583452211126,
					formattedValue: 25.9,
					formatted: '25.9',
					roundedValue: 26,
					rounded: '26',
					minimized: '25.9',
					denomination: '%',
					full: '25.9%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], "Didn't produce the expected Actions or Caclculations");
		});

		it('should place a SHORT_SELL trade for a scalar market', () => {
			store.getState().tradesInProgress.testScalarMarketID = {
				1: {
					side: 'sell',
					numShares: '10',
					limitPrice: '45',
					totalFee: '4.0739644970414199',
					totalCost: '-14.0739644970414199',
					tradeActions: [{
						action: 'SHORT_ASK',
						shares: '10',
						gasEth: '0.02791268',
						feeEth: '4.0739644970414199',
						feePercent: '0.9053254437869822',
						costEth: '-14.0739644970414199',
						avgPrice: '1.40739644970414199',
						noFeePrice: '45'
					}],
					tradingFeesEth: '4.0739644970414199',
					gasFeesRealEth: '0.02791268',
					feePercent: '22.448646886208020204'
				}
			};
			store.dispatch(action.placeTrade('testScalarMarketID', '1'));
			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_TRADE_COMMIT_LOCK',
				isLocked: true
			}, {
				type: 'short_sell',
				data: {
					marketID: 'testScalarMarketID',
					outcomeID: '1',
					marketType: 'scalar',
					marketDescription: 'test scalar market?',
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
					value: 45,
					formattedValue: 45,
					formatted: '45.0000',
					roundedValue: 45,
					rounded: '45.0000',
					minimized: '45',
					denomination: ' ETH',
					full: '45.0000 ETH'
				},
				avgPrice: {
					value: 1.407396449704142,
					formattedValue: 1.4074,
					formatted: '1.4074',
					roundedValue: 1.4074,
					rounded: '1.4074',
					minimized: '1.4074',
					denomination: ' ETH',
					full: '1.4074 ETH'
				},
				tradingFees: {
					value: 4.07396449704142,
					formattedValue: 4.074,
					formatted: '4.0740',
					roundedValue: 4.074,
					rounded: '4.0740',
					minimized: '4.074',
					denomination: ' ETH',
					full: '4.0740 ETH'
				},
				feePercent: {
					value: 22.44864688620802,
					formattedValue: 22.4,
					formatted: '22.4',
					roundedValue: 22,
					rounded: '22',
					minimized: '22.4',
					denomination: '%',
					full: '22.4%'
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
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'testScalarMarketID'
			}], `Didn't produce the expected Actions or Caclculations`);
		});
	});

	const expectedFailedTradeActions = [
		{
			type: 'CLEAR_TRADE_IN_PROGRESS',
			marketID: 'testBinaryMarketID'
		}
	];

	describe('Market Type Agnostic Tests', () => {
		it('should handle a null/undefined outcomeID', () => {
			store.dispatch(action.placeTrade('testBinaryMarketID', null));
			assert.deepEqual(store.getActions(), expectedFailedTradeActions, `Didn't produce the expected actions for passing a null outcomeID to place-trade`);

			store.clearActions();

			store.dispatch(action.placeTrade('testBinaryMarketID', undefined));
			assert.deepEqual(store.getActions(), expectedFailedTradeActions, `Didn't produce the expected actions for passing a undefined outcomeID to place-trade`);
		});

		it('should handle a null/undefined marketID', () => {
			store.dispatch(action.placeTrade(null, '1'));
			assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a null marketID to place-trade`);

			store.clearActions();

			store.dispatch(action.placeTrade(undefined, '1'));
			assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a undefined marketID to place-trade`);
		});

		it('should gracefully handle missing trade in progress', () => {
			// sending in an outcome of 3 which doesn't exist in a binary market
			store.dispatch(action.placeTrade('testBinaryMarketID', '3'));
			assert.deepEqual(store.getActions(), expectedFailedTradeActions, `Didn't produce the expected actions for passing a undefined outcomeID to place-trade`);
		});
	});
});
