/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var simulateTrade = require("../../../../src/trading/simulation/simulate-trade");

describe("trading/simulation/simulate-trade", function () {
  var test = function (t) {
    it(t.description, function () {
      try {
        t.assertions(simulateTrade(t.params));
      } catch (exc) {
        t.assertions(exc);
      }
    });
  };
  test({
    description: "simulate trade (buy)",
    params: {
      orderType: 0,
      outcome: 0,
      shares: "3",
      shareBalances: ["0", "5"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: "2",
        settlementFees: "0.006",
        worstCaseFees: "0.009",
        otherSharesDepleted: "3",
        sharesDepleted: "0",
        tokensDepleted: "0",
        shareBalances: ["0", "4"],
      });
    },
  });
  test({
    description: "simulate trade (sell)",
    params: {
      orderType: 1,
      outcome: 0,
      shares: "3",
      shareBalances: ["0", "5"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: "2",
        settlementFees: "0",
        worstCaseFees: "0",
        otherSharesDepleted: "0",
        sharesDepleted: "0",
        tokensDepleted: "0.9",
        shareBalances: ["0", "5"],
      });
    },
  });
  test({
    description: "position reversal (long to short)",
    params: {
      orderType: 1,
      outcome: 1,
      shares: "101",
      shareBalances: ["0", "100"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {
          BID_0: {
            amount: "101",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "0",
            owner: "OWNER_ADDRESS",
          },
        },
        sell: {},
      },
    },
    assertions: function (output) {
      assert.deepEqual(output,  {
        sharesFilled: "101",
        settlementFees: "0",
        worstCaseFees: "0",
        sharesDepleted: "100",
        otherSharesDepleted: "0",
        tokensDepleted: "0.3",
        shareBalances: ["0", "0"],
      });
    },
  });
  test({
    description: "position reversal (short to long)",
    params: {
      orderType: 0,
      outcome: 1,
      shares: "101",
      shareBalances: ["100", "0"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {},
        sell: {
          ASK_0: {
            amount: "101",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "101",
            owner: "OWNER_ADDRESS",
          },
        },
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesFilled: "101",
        settlementFees: "0.3",
        worstCaseFees: "0.3",
        sharesDepleted: "0",
        otherSharesDepleted: "100",
        tokensDepleted: "0.7",
        shareBalances: ["0", "0"],
      });
    },
  });
  test({
    description: "throw if order type is not defined",
    params: {
      orderType: undefined,
      outcome: 0,
      shares: "3",
      shareBalances: ["0", "5"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
      },
    },
    assertions: function (err) {
      assert.strictEqual(err.message, "Order type must be 0 (buy) or 1 (sell)");
    },
  });
  test({
    description: "throw if order type is not 0 or 1",
    params: {
      orderType: 3,
      outcome: 0,
      shares: "3",
      shareBalances: ["0", "5"],
      tokenBalance: "0",
      userAddress: "USER_ADDRESS",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      marketCreatorFeeRate: "0",
      reportingFeeRate: "0.01",
      shouldCollectReportingFees: 1,
      singleOutcomeOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS",
          },
        },
      },
    },
    assertions: function (err) {
      assert.strictEqual(err.message, "Order type must be 0 (buy) or 1 (sell)");
    },
  });
});
