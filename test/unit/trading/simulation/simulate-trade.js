/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var simulateTrade = require("../../../../src/trading/simulation/simulate-trade");

describe("trading/simulation/simulate-trade", function () {
  var test = function (t) {
    it(t.description, function () {
      var result = null;
      try {
        result = simulateTrade(t.params);
      } catch (exc) {
        result = exc;
      }
      t.assertions(result);
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
      minPrice: "0",
      maxPrice: "1",
      numTicks: "10000",
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
        shareBalances: ["0", "2"],
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
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      numTicks: "10000",
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
        shareBalances: ["0", "7"],
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
      tokenBalance: "1",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      numTicks: "10000",
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
        shareBalances: ["1", "0"],
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
      tokenBalance: "1",
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      numTicks: "10000",
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
        shareBalances: ["0", "1"],
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
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      numTicks: "10000",
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
      minPrice: "0",
      maxPrice: "1",
      price: "0.7",
      numTicks: "10000",
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
    description: "User places a BUY order for 10 shares of YES at .5 which should cost 2.5 ETH to send.",
    params: {
      "orderType": 0,
      "outcome": 1,
      "shareBalances": ["5", "0"],
      "tokenBalance": "17.121611917",
      "minPrice": "0",
      "maxPrice": "1",
      "price": 0.5,
      numTicks: "10000",
      "shares": "10",
      "marketCreatorFeeRate": "0.02",
      "singleOutcomeOrderBook": {
        "buy": {},
        "sell": {
          "0xd7043bdfa9b2e999cfede9d02ca47c3a535c48b95bd95478dc5c3764db3eff11": {
            "orderId": "0xd7043bdfa9b2e999cfede9d02ca47c3a535c48b95bd95478dc5c3764db3eff11",
            "creationBlockNumber": 1324,
            "transactionHash": "0xbb92cee8f2f49a6256406e858fb99c72a491e9582f92fb3404b3cbffc3ad3d92",
            "logIndex": 2,
            "shareToken": "0x6da40916a32047664645d4d10ef2d38e9e8948cd",
            "owner": "0xbd355a7e5a7adb23b51f54027e624bfe0e238df6",
            "creationTime": 1526836896,
            "orderState": "OPEN",
            "price": "0.5",
            "amount": "5",
            "fullPrecisionPrice": "0.5",
            "fullPrecisionAmount": "5",
            "tokensEscrowed": "0",
            "sharesEscrowed": "5",
          },
        },
      },
      "shouldCollectReportingFees": true,
      "reportingFeeRate": "0.01",
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        "otherSharesDepleted": "5",
        "settlementFees": "0.075",
        "shareBalances": [
          "0",
          "0",
        ],
        "sharesDepleted": "0",
        "sharesFilled": "5",
        "tokensDepleted": "2.5",
        "worstCaseFees": "0.075",
      });
    },
  });
});
