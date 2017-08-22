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
      type: "buy",
      outcome: 1,
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
      orderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1, // FIXME outcome not present
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1,
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
      type: "sell",
      outcome: 1,
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
      orderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1,
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1,
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
        tokensDepleted: "1.5",
        shareBalances: ["0", "5"]
      });
    }
  });
  test({
    description: 'throw if type is not defined',
    params: {
      type: undefined,
      outcome: 1,
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
      orderBook: {
        buy: {
          BID_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1,
            owner: "OWNER_ADDRESS"
          }
        },
        sell: {
          ASK_0: {
            amount: "2",
            fullPrecisionPrice: "0.7",
            sharesEscrowed: "2",
            outcome: 1,
            owner: "OWNER_ADDRESS"
          }
        }
      }
    },
    assertions: function (err) {
      assert.strictEqual(err.message, "Order type must be 'buy' or 'sell'");
    }
  });
});
