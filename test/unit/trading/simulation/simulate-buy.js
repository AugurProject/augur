/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateBuy = require("../../../../src/trading/simulation/simulate-buy");
var constants = require("../../../../src/constants");
var ZERO = constants.ZERO;

describe("trading/simulation/simulate-buy", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(simulateBuy(t.params.outcomeId, t.params.sharesToCover, t.params.shareBalances, t.params.tokenBalance, t.params.minPrice, t.params.maxPrice, t.params.price, t.params.marketCreatorFeeRate, t.params.reportingFeeRate, t.params.shouldCollectReportingFees, t.params.sellOrderBook));
    });
  };
  test({
    description: "single matching ask, taker partially filled",
    params: {
      outcomeId: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      sellOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("2", 10),
        settlementFees: new BigNumber("0.006", 10),
        worstCaseFees: new BigNumber("0.009", 10),
        otherSharesDepleted: new BigNumber("3", 10),
        sharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, new BigNumber("2", 10)],
      });
    },
  });
  test({
    description: "no matching asks",
    params: {
      outcomeId: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      sellOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.8", 10),
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("0", 10),
        settlementFees: ZERO,
        worstCaseFees: new BigNumber("0.009", 10),
        otherSharesDepleted: new BigNumber("3", 10),
        sharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, new BigNumber("2", 10)],
      });
    },
  });
  test({
    description: "two matching asks, complete fill",
    params: {
      outcomeId: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      sellOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS",
        },
        ORDER_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("3", 10),
        settlementFees: new BigNumber("0.011", 10),
        worstCaseFees: new BigNumber("0.011", 10),
        otherSharesDepleted: new BigNumber("3", 10),
        sharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, new BigNumber("2", 10)],
      });
    },
  });
});
