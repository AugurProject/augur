/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateFillBidOrder = require("../../../../src/trading/simulation/simulate-fill-bid-order");

describe("trading/simulation/simulate-fill-bid-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateFillBidOrder(t.params.sharesToCover, t.params.minPrice, t.params.maxPrice, t.params.marketCreatorFeeRate, t.params.reportingFeeRate, t.params.shouldCollectReportingFees, t.params.matchingSortedBids, t.params.outcome, t.params.shareBalances);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "maker closing short, taker closing long",
    params: {
      sharesToCover: new BigNumber("3", 10),
      minPrice: new BigNumber("0", 10),
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0", 10),
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      matchingSortedBids: [{
        amount: "2",
        fullPrecisionPrice: "0.7",
        sharesEscrowed: "2",
      }],
      outcome: 0,
      shareBalances: [new BigNumber("5", 10), new BigNumber("0", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("2", 10),
        sharesToCover: new BigNumber("1", 10),
        settlementFees: new BigNumber("0.014", 10),
        worstCaseFees: new BigNumber("0.014", 10),
        sharesDepleted: new BigNumber("2", 10),
        tokensDepleted: new BigNumber("0", 10),
        shareBalances: [new BigNumber("3", 10), new BigNumber("0", 10)],
      });
    },
  });
  test({
    description: "maker closing short, taker opening short",
    params: {
      sharesToCover: new BigNumber("2", 10),
      minPrice: new BigNumber("0", 10),
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0", 10),
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      matchingSortedBids: [{
        amount: "2",
        fullPrecisionPrice: "0.7",
        sharesEscrowed: "2",
      }],
      outcome: 0,
      shareBalances: [new BigNumber("0", 10), new BigNumber("0", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("2", 10),
        sharesToCover: new BigNumber("0", 10),
        settlementFees: new BigNumber("0", 10),
        worstCaseFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("0.6", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("2", 10)],
      });
    },
  });
  test({
    description: "maker opening long, taker closing long",
    params: {
      sharesToCover: new BigNumber("1.5", 10),
      minPrice: new BigNumber("0", 10),
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0", 10),
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      matchingSortedBids: [{
        amount: "2",
        fullPrecisionPrice: "0.7",
        sharesEscrowed: "0",
      }],
      outcome: 0,
      shareBalances: [new BigNumber("5", 10), new BigNumber("2", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("1.5", 10),
        sharesToCover: new BigNumber("0", 10),
        settlementFees: new BigNumber("0", 10),
        worstCaseFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1.5", 10),
        tokensDepleted: new BigNumber("0", 10),
        shareBalances: [new BigNumber("3.5", 10), new BigNumber("2", 10)],
      });
    },
  });
  test({
    description: "maker opening long, taker opening short",
    params: {
      sharesToCover: new BigNumber("2", 10),
      minPrice: new BigNumber("0", 10),
      maxPrice: new BigNumber("1", 10),
      marketCreatorFeeRate: new BigNumber("0", 10),
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      matchingSortedBids: [{
        amount: "2",
        fullPrecisionPrice: "0.7",
        sharesEscrowed: "0",
      }],
      outcome: 0,
      shareBalances: [new BigNumber("0", 10), new BigNumber("0", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: new BigNumber("2", 10),
        sharesToCover: new BigNumber("0", 10),
        settlementFees: new BigNumber("0", 10),
        worstCaseFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("0.6", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("2", 10)],
      });
    },
  });
});
