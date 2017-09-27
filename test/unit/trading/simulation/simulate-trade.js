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
      marketOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        settlementFees: "0.006",
        gasFees: "0",
        otherSharesDepleted: "3",
        sharesDepleted: "0",
        tokensDepleted: "0",
        shareBalances: ["0", "4"]
      });
    }
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
      marketOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        settlementFees: "0",
        gasFees: "0",
        otherSharesDepleted: "0",
        sharesDepleted: "0",
        tokensDepleted: "0.9",
        shareBalances: ["0", "5"]
      });
    }
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
      marketOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        }
      }
    },
    assertions: function (err) {
      assert.strictEqual(err.message, "Order type must be 1 (buy) or 2 (sell)");
    }
  });
  test({
    description: "throw if order type is not 1 or 2",
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
      marketOrderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            owner: "OWNER_ADDRESS"
          }
        }
      }
    },
    assertions: function (err) {
      assert.strictEqual(err.message, "Order type must be 1 (buy) or 2 (sell)");
    }
  });
});
