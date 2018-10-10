/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateCreateBidOrder = require("../../../../src/trading/simulation/simulate-create-bid-order");
var constants = require("../../../../src/constants");
var ZERO = constants.ZERO;

describe("trading/simulation/simulate-create-bid-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateCreateBidOrder(t.params.numShares, t.params.price, t.params.minPrice, t.params.maxPrice, t.params.marketCreatorFeeRate, t.params.reportingFeeRate, t.params.shouldCollectReportingFees, t.params.outcome, t.params.shareBalances);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "[0, 0] shares held, 0 minimum price, bid 2 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 1,
      shareBalances: [ZERO, ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: new BigNumber("1.2", 10),
        shareBalances: [ZERO, ZERO],
      });
    },
  });
  test({
    description: "[0, 0] shares held, 7 minimum price, bid 2 shares of outcome 1 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 1,
      shareBalances: [ZERO, ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: new BigNumber("1.2", 10),
        shareBalances: [ZERO, ZERO],
      });
    },
  });
  test({
    description: "[3, 0] shares held, 7 minimum price, bid 2 shares of outcome 0 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3", 10), ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: new BigNumber("1.2", 10),
        shareBalances: [new BigNumber("3", 10), ZERO],
      });
    },
  });
  test({
    description: "[3, 4] shares held, 7 minimum price, bid 2 shares of outcome 0 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3", 10), new BigNumber("4", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.312", 10),
        otherSharesDepleted: new BigNumber("2", 10),
        tokensDepleted: ZERO,
        shareBalances: [new BigNumber("3", 10), new BigNumber("2", 10)],
      });
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 shares of outcome 1 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 1,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.312", 10),
        otherSharesDepleted: new BigNumber("2", 10),
        tokensDepleted: ZERO,
        shareBalances: [new BigNumber("1", 10), new BigNumber("1", 10)],
      });
    },
  });
  test({
    description: "[3, 1, 4, 1.2] shares held, 7 minimum price, bid 2 shares of outcome 1 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 1,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10), new BigNumber("4", 10), new BigNumber("1.2", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.1872", 10),
        otherSharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.48", 10),
        shareBalances: [new BigNumber("1.8", 10), new BigNumber("1", 10), new BigNumber("2.8", 10), ZERO],
      });
    },
  });
  test({
    description: "[3.1, 1.2] shares held, 6.9 minimum price, bid 2.4 shares of outcome 0 @ 7.6",
    params: {
      numShares: new BigNumber("2.4", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("6.9", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3.1", 10), new BigNumber("1.2", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.1872", 10),
        otherSharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.84", 10),
        shareBalances: [new BigNumber("3.1", 10), ZERO],
      });
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 0 shares of outcome 0 @ 7.6",
    params: {
      numShares: ZERO,
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Number of shares is too small"));
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 shares of outcome 0 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Price is below the minimum price"));
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 shares of outcome -1 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: -1,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 shares of outcome 2 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      maxPrice: new BigNumber("10", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 2,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    },
  });
});
