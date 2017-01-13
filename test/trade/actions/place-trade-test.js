import augur from 'augur.js';
import uuidParse from 'uuid-parse';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { BUY, tradeTestState, tradeConstOrderBooks, stubCalculateBuyTradeIDs, stubCalculateSellTradeIDs } from 'test/trade/constants';

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
  const mockCalculateTradeIDs = {
    calculateBuyTradeIDs: () => {},
    calculateSellTradeIDs: () => {}
  };
  const mockMakeOrder = {
    placeBid: () => {},
    placeAsk: () => {},
    placeShortAsk: () => {}
  };
  const mockTakeOrder = {
    placeBuy: () => {},
    placeSell: () => {},
    placeShortSell: () => {}
  };
  const mockAugur = {
    abi: {
      bignum: () => {},
      format_int256: () => {}
    },
    augur: {
      getParticipantSharesPurchased: () => {}
    }
  };
  sinon.stub(mockSelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
  sinon.stub(mockCalculateTradeIDs, 'calculateBuyTradeIDs', stubCalculateBuyTradeIDs);
  sinon.stub(mockCalculateTradeIDs, 'calculateSellTradeIDs', stubCalculateSellTradeIDs);
  sinon.stub(mockMakeOrder, 'placeBid', (market, outcomeID, numShares, limitPrice, tradeGroupID) => (
		store.dispatch({
  type: 'PLACE_BID',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(mockMakeOrder, 'placeAsk', (market, outcomeID, numShares, limitPrice, tradeGroupID) => (
		store.dispatch({
  type: 'PLACE_ASK',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(mockMakeOrder, 'placeShortAsk', (market, outcomeID, numShares, limitPrice, tradeGroupID) => (
		store.dispatch({
  type: 'PLACE_SHORT_ASK',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(mockTakeOrder, 'placeBuy', (market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) => (
		dispatch => store.dispatch({
  type: 'PLACE_BUY',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(mockTakeOrder, 'placeSell', (market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) => (
		dispatch => store.dispatch({
  type: 'PLACE_SELL',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(mockTakeOrder, 'placeShortSell', (market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) => (
		dispatch => store.dispatch({
  type: 'PLACE_SHORT_SELL',
  params: [market, outcomeID, numShares, limitPrice, tradeGroupID]
})
	));
  sinon.stub(uuidParse, 'parse', n => new Buffer('00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09', 'hex').toJSON().data);
  sinon.stub(mockAugur.abi, 'bignum', n => augur.abi.bignum(n));
  sinon.stub(mockAugur.abi, 'format_int256', n => augur.abi.format_int256(n));
  sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
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
    '../../trade/actions/helpers/calculate-trade-ids': mockCalculateTradeIDs,
    '../../trade/actions/make-order': mockMakeOrder,
    '../../trade/actions/take-order': mockTakeOrder
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
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_BUY',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
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
        type: 'PLACE_BID',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.35',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
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
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
    });
    it('should place a ASK and SHORT_ASK trade for a binary market', () => {
      store.dispatch(action.placeTrade('testBinaryMarketID', '2'));
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '5',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '5',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
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
        type: 'PLACE_SELL',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
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
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
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
        type: 'PLACE_SHORT_SELL',
        params: [
          {
            author: 'testAuthor1',
            branchID: '0x010101',
            creationFee: '22.5',
            creationTime: 1475951522,
            cumulativeScale: '1',
            description: 'test binary market?',
            endDate: 1495317600,
            eventID: 'testEventID1',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.002',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            sortOrder: 0,
            tags: [
              'binary',
              'markets',
              null
            ],
            takerFee: '0.01',
            tradingFee: '0.008',
            tradingPeriod: 8653,
            type: 'binary',
            volume: '3030',
            winningOutcomes: []
          },
          '2',
          '10',
          '0.45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testBinaryMarketID'
      }]);
    });
  });

  describe('Categorical Market Place Trade Tests', () => {
    it('should place a BUY trade for a categorical market', () => {
      store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_BUY',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
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
        type: 'PLACE_BID',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.35',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
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
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
    });
    it('should place a ASK and SHORT_ASK trade for a categorical market', () => {
      store.dispatch(action.placeTrade('testCategoricalMarketID', '1'));
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '5',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '5',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
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
        type: 'PLACE_SELL',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
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
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.5',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
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
        type: 'PLACE_SHORT_SELL',
        params: [
          {
            author: 'testAuthor2',
            branchId: '0x010101',
            creationFee: '12.857142857142857142',
            creationTime: 1476694751,
            cumulativeScale: '1',
            description: 'test categorical market?',
            endDate: 2066554498,
            eventID: 'testEventID2',
            extraInfo: 'extra info',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.001000000000000000006',
            maxValue: '2',
            minValue: '1',
            network: '2',
            numEvents: 1,
            numOutcomes: 4,
            resolution: 'http://lmgtfy.com',
            sortOrder: 7,
            tags: [
              'categorical',
              'markets',
              'test'
            ],
            takerFee: '0.019999999999999999994',
            tradingFee: '0.014',
            tradingPeriod: 11959,
            type: 'categorical',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '0.45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testCategoricalMarketID'
      }]);
    });
  });

  describe('Scalar Market Place Trade Tests', () => {
    it('should place a BUY trade for a scalar market', () => {
      store.dispatch(action.placeTrade('testScalarMarketID', '1'));
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_BUY',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '55',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
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
        type: 'PLACE_BID',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '35',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
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
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '55',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
    });

    it('should place a ASK and SHORT_ASK trade for a scalar market', () => {
      store.dispatch(action.placeTrade('testScalarMarketID', '1'));
      assert.deepEqual(store.getActions(), [{
        type: 'PLACE_ASK',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '5',
          '55',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '5',
          '55',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
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
        type: 'PLACE_SELL',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
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
        type: 'PLACE_SHORT_ASK',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '55',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
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
        type: 'PLACE_SHORT_SELL',
        params: [
          {
            author: 'testAuthor3',
            branchID: '0x010101',
            creationFee: '9',
            creationTime: 1476486515,
            cumulativeScale: '130',
            description: 'test scalar market?',
            endDate: 1496514800,
            eventID: 'testEventID3',
            isLoadedMarketInfo: true,
            isEthical: undefined,
            reportedOutcome: undefined,
            makerFee: '0.01',
            maxValue: '120',
            minValue: '-10',
            network: '2',
            numEvents: 1,
            numOutcomes: 2,
            resolution: 'https://www.resolution-of-market.com',
            sortOrder: 3,
            tags: [
              'scalar',
              'markets',
              'test'
            ],
            takerFee: '0.02',
            tradingFee: '0.02',
            tradingPeriod: 8544,
            type: 'scalar',
            volume: '0',
            winningOutcomes: []
          },
          '1',
          '10',
          '45',
          '0x00000000000000000000000000000000c1bba17b27594861a799ebc37b7baa09'
        ]
      }, {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'testScalarMarketID'
      }]);
    });
  });

  const expectedFailedTradeActions = [{
    type: 'CLEAR_TRADE_IN_PROGRESS',
    marketID: 'testBinaryMarketID'
  }];

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
  });
});
