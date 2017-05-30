"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");
var clearCallCounts = require("../../tools").clearCallCounts;
// 17 tests total

describe("generateTradeGroupID", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require('../../../src/trading/group/generate-trade-group-id')());
    });
  };
  test({
    description: 'Should return a int256 string to be used as a tradeGroupID.',
    assertions: function (output) {
      assert.isString(output);
      // we expect this value to be padded and prefixed, so confirm that
      assert.include(output, '0x0');
    }
  });
});

describe("executeTradingActions", function () {
  // 4 tests total
  var tradeGroupIDtoAssert;
  var finished;
  afterEach(function () {
    tradeGroupIDtoAssert = undefined;
  });
  var test = function (t) {
    it(t.description, function (done) {
      finished = done;
      var executeTradingActions = proxyquire('../../../src/trading/group/execute-trading-actions', {
        './place-trade': t.placeTrade
      });

      executeTradingActions({}, t.market, t.outcomeID, t.address, t.getOrderBooks, t.doNotMakeOrders, t.tradesInProgress, t.tradeCommitmentCallback, t.tradeCommitLockCallback, t.callback);
    });
  };
  test({
    description: 'Should handle an array of tradesInProgress for a given market.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    address: '0x1',
    getOrderBooks: function () {
      return { '0xa1': {buy: {}, sell: {}}};
    },
    doNotMakeOrders: false,
    tradesInProgress: [
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '100',
        limitPrice: '0.5',
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '50',
        limitPrice: '0.35',
        tradingFeesEth: '0.01',
        totalCost: '18'
      },
      {
        marketID: '0xa1',
        side: 'sell',
        numShares: '150',
        limitPrice: '0.75',
        tradingFeesEth: '0.01',
        totalCost: '114'
      }
    ],
    tradeCommitmentCallback: undefined,
    tradeCommitLockCallback: undefined,
    placeTrade: function (p, market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.deepEqual(outcomeID, '1');
      assert.deepEqual(address, '0x1');
      assert.isBoolean(doNotMakeOrders);
      assert.oneOf(tradeType, ['buy', 'sell']);
      assert.oneOf(numShares, ['100', '50', '150']);
      assert.oneOf(limitPrice, ['0.35', '0.5', '0.75']);
      assert.deepEqual(tradingFees, '0.01');
      assert.oneOf(totalCost, ['114', '18', '51']);
      // assign the tradeGroupID to our variable to test later to confirm that we get out the tradeGroupID we pass in to placeTrade.
      tradeGroupIDtoAssert = tradeGroupID;
      // now call the callback with no error as placeTrade would.
      callback(null);
    },
    callback: function (err, tradeGroupID) {
      assert.isNull(err);
      assert.deepEqual(tradeGroupID, tradeGroupIDtoAssert);
      finished();
    }
  });
  test({
    description: 'Should handle an array of tradesInProgress for a given market, callback is undefined.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    address: '0x1',
    getOrderBooks: function () {
      return { '0xa1': {buy: {}, sell: {}}};
    },
    doNotMakeOrders: false,
    tradesInProgress: [
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '100',
        limitPrice: '0.5',
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '50',
        limitPrice: '0.35',
        tradingFeesEth: '0.01',
        totalCost: '18'
      },
      {
        marketID: '0xa1',
        side: 'sell',
        numShares: '150',
        limitPrice: '0.75',
        tradingFeesEth: '0.01',
        totalCost: '114'
      }
    ],
    tradeCommitmentCallback: undefined,
    tradeCommitLockCallback: undefined,
    placeTrade: function (p, market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.deepEqual(outcomeID, '1');
      assert.deepEqual(address, '0x1');
      assert.isBoolean(doNotMakeOrders);
      assert.oneOf(tradeType, ['buy', 'sell']);
      assert.oneOf(numShares, ['100', '50', '150']);
      assert.oneOf(limitPrice, ['0.35', '0.5', '0.75']);
      assert.deepEqual(tradingFees, '0.01');
      assert.oneOf(totalCost, ['114', '18', '51']);
      // just assert that the tradeGroupID is generated
      assert.isString(tradeGroupID);
      assert.include(tradeGroupID, '0x');
      assert.deepEqual(tradeGroupID.length, 66);
      // complete the test since callback should just be a noop function.
      finished();
    },
    callback: undefined
  });
  test({
    description: 'Should handle an array of tradesInProgress for a given market but some of the tradesInProgress arent sent to placeTrade.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    address: '0x1',
    getOrderBooks: function () {
      return { '0xa1': {buy: {}, sell: {}}};
    },
    doNotMakeOrders: false,
    tradesInProgress: [
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '100',
        limitPrice: '0.5',
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '25',
        limitPrice: undefined,
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '50',
        limitPrice: '0.35',
        tradingFeesEth: '0.01',
        totalCost: '18'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: undefined,
        limitPrice: '0.24',
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '30',
        limitPrice: '0.6',
        tradingFeesEth: '0.01',
        totalCost: undefined
      },
      {
        marketID: '0xa1',
        side: 'sell',
        numShares: '150',
        limitPrice: '0.75',
        tradingFeesEth: '0.01',
        totalCost: '114'
      }
    ],
    tradeCommitmentCallback: undefined,
    tradeCommitLockCallback: undefined,
    placeTrade: function (p, market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.deepEqual(outcomeID, '1');
      assert.deepEqual(address, '0x1');
      assert.isBoolean(doNotMakeOrders);
      assert.oneOf(tradeType, ['buy', 'sell']);
      assert.oneOf(numShares, ['100', '50', '150']);
      assert.oneOf(limitPrice, ['0.35', '0.5', '0.75']);
      assert.deepEqual(tradingFees, '0.01');
      assert.oneOf(totalCost, ['114', '18', '51']);
      // assign the tradeGroupID to our variable to test later to confirm that we get out the tradeGroupID we pass in to placeTrade.
      tradeGroupIDtoAssert = tradeGroupID;
      // now call the callback with no error as placeTrade would.
      callback(null);
    },
    callback: function (err, tradeGroupID) {
      assert.isNull(err);
      assert.deepEqual(tradeGroupID, tradeGroupIDtoAssert);
      finished();
    }
  });
  test({
    description: 'Should handle an error back from placeTrade',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    address: '0x1',
    getOrderBooks: function () {
      return { '0xa1': {buy: {}, sell: {}}};
    },
    doNotMakeOrders: false,
    tradesInProgress: [
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '100',
        limitPrice: '0.5',
        tradingFeesEth: '0.01',
        totalCost: '51'
      },
      {
        marketID: '0xa1',
        side: 'buy',
        numShares: '50',
        limitPrice: '0.35',
        tradingFeesEth: '0.01',
        totalCost: '18'
      },
      {
        marketID: '0xa1',
        side: 'sell',
        numShares: '150',
        limitPrice: '0.75',
        tradingFeesEth: '0.01',
        totalCost: '114'
      }
    ],
    tradeCommitmentCallback: undefined,
    tradeCommitLockCallback: undefined,
    placeTrade: function (p, market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.deepEqual(outcomeID, '1');
      assert.deepEqual(address, '0x1');
      assert.isBoolean(doNotMakeOrders);
      assert.oneOf(tradeType, ['buy', 'sell']);
      assert.oneOf(numShares, ['100', '50', '150']);
      assert.oneOf(limitPrice, ['0.35', '0.5', '0.75']);
      assert.deepEqual(tradingFees, '0.01');
      assert.oneOf(totalCost, ['114', '18', '51']);
      // assign the tradeGroupID to our variable to test later to confirm that we get out the tradeGroupID we pass in to placeTrade.
      tradeGroupIDtoAssert = tradeGroupID;
      // now call the callback with an error as placeTrade might.
      callback({ error: 999, message: 'Uh-Oh!' });
    },
    callback: function (err, tradeGroupID) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      assert.isUndefined(tradeGroupID);
      finished();
    }
  });
});

describe("placeTrade.placeTrade", function () {
  // 12 tests total
  var finished;
  var getParticipantSharesPurchased = augur.api.Markets.getParticipantSharesPurchased;
  var callCounts = {
    placeBuy: 0,
    placeBid: 0,
    placeSell: 0,
    placeAsk: 0,
    placeShortAsk: 0,
    placeAskAndShortAsk: 0,
    placeShortSell: 0,
    calculateBuyTradeIDs: 0,
    calculateSellTradeIDs: 0,
    getParticipantSharesPurchased: 0
  };
  afterEach(function () {
    // Clear the counts object after each test.
    clearCallCounts(callCounts);
    augur.api.Markets.getParticipantSharesPurchased = getParticipantSharesPurchased;
  });
  var test = function (t) {
    it(t.description, function (done) {
      finished = done;
      var placeTrade = proxyquire('../../../src/trading/group/place-trade', {
        '../take-order/calculate-buy-trade-ids': t.calculateBuyTradeIDs,
        '../take-order/calculate-sell-trade-ids': t.calculateSellTradeIDs,
        '../take-order/place-buy': t.placeBuy,
        '../take-order/place-sell': t.placeSell,
        '../take-order/place-short-sell': t.placeShortSell,
        '../make-order/place-bid': t.placeBid,
        '../make-order/place-ask': t.placeAsk,
        '../make-order/place-short-ask': t.placeShortAsk,
        '../make-order/place-ask-and-short-ask': t.placeAskAndShortAsk,
      });

      augur.api.Markets.getParticipantSharesPurchased = t.getParticipantSharesPurchased;

      placeTrade({}, t.market, t.outcomeID, t.tradeType, t.numShares, t.limitPrice, t.tradingFees, t.address, t.totalCost, t.getOrderBooks, t.doNotMakeOrders, t.tradeGroupID, t.tradeCommitmentCallback, t.tradeCommitLockCallback, t.assertions);
    });
  };
  test({
    description: 'Should not place a buy trade if doNotMakeOrders is true and no matching trades can be made on the orderbook',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'buy',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '51',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: true,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
      return [];
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 1,
        calculateSellTradeIDs: 0,
        getParticipantSharesPurchased: 0
      });
      finished();
    }
  });
  test({
    description: 'Should place a buy trade when a matching order is found on the order book',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'buy',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '51',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: { '0xb1': { amount: '1000', price: '0.5' }} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(numShares, '100');
      assert.equal(limitPrice, '0.5');
      assert.equal(address, '0x1');
      assert.equal(totalCost, '51');
      assert.equal(tradingFees, '0.01');
      assert.deepEqual(getOrderBooks(), { '0xa1': { buy: {}, sell: { '0xb1': { amount: '1000', price: '0.5' }} } });
      assert.isFalse(doNotMakeOrders);
      assert.equal(tradeGroupID, '0x000abc123');
      assert.isFunction(tradeCommitmentCallback);
      assert.isFunction(tradeCommitLockCallback);
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
      return ['0xb1'];
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 1,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 1,
        calculateSellTradeIDs: 0,
        getParticipantSharesPurchased: 0
      });
      finished();
    }
  });
  test({
    description: 'Should place a bid trade when no matching order is found on the order book and doNotMakeOrders is set to false',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'buy',
    numShares: '120',
    limitPrice: '0.6',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '73.2',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(numShares, '120');
      assert.equal(limitPrice, '0.6');
      assert.equal(tradeGroupID, '0x000abc123');
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
      return [];
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 1,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 1,
        calculateSellTradeIDs: 0,
        getParticipantSharesPurchased: 0
      });
      finished();
    }
  });
  test({
    description: 'Should not place a sell trade if getParticipantSharesPurchased returns undefined',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb(undefined);
    },
    assertions: function (err) {
      assert.isUndefined(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 0,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should not place a sell trade if getParticipantSharesPurchased returns an error object',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    assertions: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 0,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should place a sell trade if there are matching orders on the book and the user has a position with enough shares to sell',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.5' } }, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(numShares, '100');
      assert.equal(limitPrice, '0.5');
      assert.equal(address, '0x1');
      assert.equal(totalCost, '50');
      assert.equal(tradingFees, '0.01');
      assert.deepEqual(getOrderBooks(), { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.5' }}, sell: {} } });
      assert.isFalse(doNotMakeOrders);
      assert.equal(tradeGroupID, '0x000abc123');
      assert.isFunction(tradeCommitmentCallback);
      assert.isFunction(tradeCommitLockCallback);
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return ['0xb1'];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('100');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 1,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should not place a trade if we have a position to sell but no buy orders on the book, we also have doNotMakeOrders set to true.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: true,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return [];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('100');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should not place a trade if we have a position to sell but no buy orders on the book, we also have doNotMakeOrders set to false.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return [];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('100');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 1,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should place an ask and a shortAsk if we have a position that is less than the amount of shares we plan to sell and doNotMakeOrders is false',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(askShares, '80');
      assert.equal(shortAskShares, '20');
      assert.equal(limitPrice, '0.5');
      assert.equal(tradeGroupID, '0x000abc123');
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return [];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('80');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 1,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should place a shortSell trade if no position and we do have a buy order to match our sell order on the book',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.5' } }, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(numShares, '100');
      assert.equal(limitPrice, '0.5');
      assert.equal(address, '0x1');
      assert.equal(totalCost, '50');
      assert.equal(tradingFees, '0.01');
      assert.deepEqual(getOrderBooks(), { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.5' } }, sell: {} } });
      assert.isFalse(doNotMakeOrders);
      assert.equal(tradeGroupID, '0x000abc123');
      assert.isFunction(tradeCommitmentCallback);
      assert.isFunction(tradeCommitLockCallback);
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return ['0xb1'];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('0');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 1,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should place a shortAsk trade if no position, no order on the book to match, and doNotMakeOrders is false',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: false,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeShortAsk++;
      assert.deepEqual(market, { id: '0xa1', type: 'binary' });
      assert.equal(outcomeID, '1');
      assert.equal(shortAskShares, '100');
      assert.equal(limitPrice, '0.5');
      assert.equal(tradeGroupID, '0x000abc123');
      callback(null);
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return [];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('0');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 1,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
  test({
    description: 'Should not place any trade if we have no position, no orders on the book to match and doNotMakeOrders is true.',
    market: { id: '0xa1', type: 'binary' },
    outcomeID: '1',
    tradeType: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradingFees: '0.01',
    address: '0x1',
    totalCost: '50',
    getOrderBooks: function () {
      return { '0xa1': { buy: {}, sell: {} } };
    },
    doNotMakeOrders: true,
    tradeGroupID: '0x000abc123',
    tradeCommitmentCallback: noop,
    tradeCommitLockCallback: noop,
    placeBuy: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeBuy++;
      callback(null);
    },
    placeBid: function (p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeBid++;
      callback(null);
    },
    placeSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeSell++;
      callback(null);
    },
    placeAsk: function (p, market, outcomeID, askShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAsk++;
      callback(null);
    },
    placeShortAsk: function (p, market, outcomeID, shortAskShares, limitPrice, tradeGroupID) {
      callCounts.placeShortAsk++;
    },
    placeShortSell: function (p, market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
      callCounts.placeShortSell++;
      callback(null);
    },
    placeAskAndShortAsk: function (p, market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
      callCounts.placeAskAndShortAsk++;
      callback(null);
    },
    calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateBuyTradeIDs++;
    },
    calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
      callCounts.calculateSellTradeIDs++;
      return [];
    },
    getParticipantSharesPurchased: function (p, cb) {
      callCounts.getParticipantSharesPurchased++;
      cb('0');
    },
    assertions: function (err) {
      assert.isNull(err);
      // check the entire callCounts object so that we know we didn't accidently call anything...
      assert.deepEqual(callCounts, {
        placeBuy: 0,
        placeBid: 0,
        placeSell: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        placeAskAndShortAsk: 0,
        placeShortSell: 0,
        calculateBuyTradeIDs: 0,
        calculateSellTradeIDs: 1,
        getParticipantSharesPurchased: 1
      });
      finished();
    }
  });
});
