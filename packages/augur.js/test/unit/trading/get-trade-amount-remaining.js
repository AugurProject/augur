/* eslint-env mocha */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache().noCallThru();
var orderFilledInputs = require("augur-core").abi.Augur.find(function (functionOrEventAbi) {
  return functionOrEventAbi.name === "OrderFilled" && functionOrEventAbi.type === "event";
}).inputs;

var mockEventsAbi = {
  Augur: {
    OrderFilled: {
      signature: "ORDER_FILLED_SIGNATURE",
      inputs: orderFilledInputs,
    },
    OrderCreated: {
      signature: "ORDER_CREATED_SIGNATURE",
      inputs: orderFilledInputs,
    },
  },
};

describe("trading/get-trade-amount-remaining", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getTradeAmountRemaining = proxyquire("../../../src/trading/get-trade-amount-remaining", {
        "../contracts": t.mock.contracts,
        "../rpc-interface": t.mock.ethrpc,
      });
      getTradeAmountRemaining(t.params, function (err, tradeOnChainAmountRemaining) {
        t.assertions(err, tradeOnChainAmountRemaining);
        done();
      });
    });
  };
  test({
    description: "get trade amount remaining using transaction hash",
    params: {
      transactionHash: "TRANSACTION_HASH",
      startingOnChainAmount: new BigNumber("100000000000000", 10),
      tickSize: new BigNumber("0.0001", 10),
    },
    mock: {
      contracts: { abi: { events: mockEventsAbi } },
      ethrpc: {
        getTransactionReceipt: function (transactionHash, callback) {
          assert.strictEqual(transactionHash, "TRANSACTION_HASH");
          callback(null, {
            logs: [{
              topics: ["MAKE_ORDER_SIGNATURE"],
            }, {
              topics: ["ORDER_FILLED_SIGNATURE"],
              // {
              //   "universe": "0xa0e4dc62cb7429825f6e1b49841a0445b37152bb",
              //   "shareToken": "0x9a219705030fb40f9386a0695a7655029a33db3e",
              //   "filler": "0x113b462d14c542d208f5262d82e2eafd7cffd88a",
              //   "orderId": "0x310f0ac5caf57e91843f7aad497028afd556a0438e1f8e80bcc5f15be4f93f0a",
              //   "numCreatorShares": "0",
              //   "numCreatorTokens": "1300000000000000",
              //   "numFillerShares": "0",
              //   "numFillerTokens": "700000000000000",
              //   "marketCreatorFees": "0",
              //   "reporterFees": "0",
              //   "amountFilled": "200000000000",
              //   "tradeGroupId": "0x2af652eae7b92bb7398c51c23b8e4d1b45b8edaa0c300c01a0964ecdf7097d86",
              //   "address": "0x25ff5dc79a7c4e34254ff0f4a19d69e491201dd3",
              //   "removed": false,
              //   "transactionHash": "0x348b1d4c294b8756f79aedec206a2877e7a70bfa47fc622cb7c534eacda74e64",
              //   "transactionIndex": 0,
              //   "logIndex": 74,
              //   "blockNumber": 2112,
              //   "blockHash": "0xf80fd8941946eafb33be51c0daa1a80f2d9c01c01e1fccabf4e03ba890adb9de",
              //   "contractName": "Augur",
              //   "eventName": "OrderFilled"
              // }
              data: "0x"+
                "000000000000000000000000113b462d14c542d208f5262d82e2eafd7cffd88a"+ // address filler
                "310f0ac5caf57e91843f7aad497028afd556a0438e1f8e80bcc5f15be4f93f0a"+ // bytes32 orderId
                "0000000000000000000000000000000000000000000000000000000000000000"+ // uint256 numCreatorShares
                "00000000000000000000000000000000000000000000000000049e57d6354000"+ // uint256 numCreatorTokens
                "0000000000000000000000000000000000000000000000000000000000000000"+ // uint256 numFillerShares
                "00000000000000000000000000000000000000000000000000027ca57357c000"+ // uint256 numFillerTokens
                "0000000000000000000000000000000000000000000000000000000000000000"+ // uint256 marketCreatorFees
                "0000000000000000000000000000000000000000000000000000000000000000"+ // uint256 reporterFees
                "0000000000000000000000000000000000000000000000000000002e90edd000"+ // uint256 amountFilled
                "2af652eae7b92bb7398c51c23b8e4d1b45b8edaa0c300c01a0964ecdf7097d86", // bytes32 tradeGroupId
            }],
          });
        },
      },
    },
    assertions: function (err, tradeOnChainAmountRemaining) {
      assert.isNull(err);
      assert.strictEqual(tradeOnChainAmountRemaining.toFixed(), "99800000000000");
    },
  });
  test({
    description: "logs not present in receipt",
    params: {
      transactionHash: "TRANSACTION_HASH",
      startingOnChainAmount: new BigNumber("100000000000000", 10),
      tickSize: new BigNumber("0.0001", 10),
    },
    mock: {
      contracts: { abi: { events: mockEventsAbi } },
      ethrpc: {
        getTransactionReceipt: function (transactionHash, callback) {
          assert.strictEqual(transactionHash, "TRANSACTION_HASH");
          callback(null, {});
        },
      },
    },
    assertions: function (err, tradeOnChainAmountRemaining) {
      assert.isNull(err);
      assert.strictEqual(tradeOnChainAmountRemaining.toFixed(), "100000000000000");
    },
  });
});
