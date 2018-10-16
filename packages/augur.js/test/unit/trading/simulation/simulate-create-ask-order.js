/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateCreateAskOrder = require("../../../../src/trading/simulation/simulate-create-ask-order");
var constants = require("../../../../src/constants");
var ZERO = constants.ZERO;

describe("trading/simulation/simulate-create-ask-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateCreateAskOrder(t.params.numShares, t.params.price, t.params.minPrice, t.params.maxPrice, t.params.marketCreatorFeeRate, t.params.reportingFeeRate, t.params.shouldCollectReportingFees, t.params.outcome, t.params.shareBalances);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "[0, 0] shares held, 1 maximum price, ask 2 shares of outcome 0 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [ZERO, ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: ZERO,
        sharesDepleted: ZERO,
        tokensDepleted: new BigNumber("0.8", 10),
        shareBalances: [ZERO, ZERO],
      });
    },
  });
  test({
    description: "[0, 4] shares held, 5 maximum price, ask 2 shares of outcome 0 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("5", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [ZERO, new BigNumber("4", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: ZERO,
        sharesDepleted: ZERO,
        tokensDepleted: new BigNumber("8.8", 10),
        shareBalances: [ZERO, new BigNumber("4", 10)],
      });
    },
  });
  test({
    description: "[3, 0] shares held, 5 maximum price, ask 2 shares of outcome 0 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("5", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("3", 10), ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.078", 10),
        sharesDepleted: new BigNumber("2", 10),
        tokensDepleted: ZERO,
        shareBalances: [new BigNumber("1", 10), ZERO],
      });
    },
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 2 shares of outcome 0 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("5", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("1", 10), ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.039", 10),
        sharesDepleted: new BigNumber("1", 10),
        tokensDepleted: new BigNumber("4.4", 10),
        shareBalances: [ZERO, ZERO],
      });
    },
  });
  //NB - PG: Negative values? What is this testing
  test({
    description: "[1.2, 3.3] shares held, -2.1 maximum price, ask 1.9 shares of outcome 0 @ -2.6",
    params: {
      numShares: new BigNumber("1.9", 10),
      price: new BigNumber("-2.6", 10),
      minPrice: new BigNumber("-3.1", 10),
      maxPrice: new BigNumber("-2.1", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("1.2", 10), new BigNumber("3.3", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        worstCaseFees: new BigNumber("0.039", 10),
        sharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.35", 10),
        shareBalances: [ZERO, new BigNumber("3.3", 10)],
      });
    },
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 0 shares of outcome 0 @ 0.6",
    params: {
      numShares: ZERO,
      price: new BigNumber("0.6", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("5", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("1", 10), ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Number of shares is too small"));
    },
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 2 shares of outcome 0 @ 5.1",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("5.1", 10),
      minPrice: ZERO,
      maxPrice: new BigNumber("5", 10),
      marketCreatorFeeRate: new BigNumber("0.015", 10),
      shouldCollectReportingFees: true,
      reportingFeeRate: new BigNumber("0.05", 10),
      outcome: 0,
      shareBalances: [new BigNumber("1", 10), ZERO],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Price is above the maximum price"));
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, ask 2 shares of outcome 0 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      outcome: -1,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    },
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, ask 2 shares of outcome 3 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      outcome: 2,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    },
  });
});
