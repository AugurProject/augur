/* eslint-env mocha */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache().noCallThru();

var orderFilledInputs = [{
  indexed: true,
  name: "universe",
  type: "address",
},
{
  indexed: true,
  name: "shareToken",
  type: "address",
},
{
  indexed: false,
  name: "filler",
  type: "address",
},
{
  indexed: false,
  name: "orderId",
  type: "bytes32",
},
{
  indexed: false,
  name: "numCreatorShares",
  type: "uint256",
},
{
  indexed: false,
  name: "numCreatorTokens",
  type: "uint256",
},
{
  indexed: false,
  name: "numFillerShares",
  type: "uint256",
},
{
  indexed: false,
  name: "numFillerTokens",
  type: "uint256",
},
{
  indexed: false,
  name: "marketCreatorFees",
  type: "uint256",
},
{
  indexed: false,
  name: "reporterFees",
  type: "uint256",
},
{
  indexed: false,
  name: "tradeGroupId",
  type: "uint256",
}];

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
      startingOnChainAmount: new BigNumber("0x5af3107a4000", 16), // 1
      onChainFillPrice: new BigNumber("0x1500", 16), // 0.0276
      tickSize: new BigNumber("0.0001", 10),
    },
    mock: {
      contracts: {
        abi: {
          events: {
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
          },
        },
      },
      ethrpc: {
        getTransactionReceipt: function (transactionHash, callback) {
          callback(null, {
            logs: [{
              topics: ["MAKE_ORDER_SIGNATURE"],
            }, {
              topics: ["ORDER_FILLED_SIGNATURE"],
              data: "0x00000000000000000000000095f75c360c056cf4e617f5ba2d9442706d6d43ed161860bb2d8b44d9b1faf2e220edd8ed17361b4fd00a87b129c22f0aacf4741800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000148454f793f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000620e0dc3cd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a",
            }],
          });
        },
      },
    },
    assertions: function (err, tradeOnChainAmountRemaining) {
      assert.isNull(err);
      assert.strictEqual(tradeOnChainAmountRemaining.toFixed(), "82812500000000");
    },
  });
  test({
    description: "logs not present in receipt",
    params: {
      transactionHash: "TRANSACTION_HASH",
      startingOnChainAmount: new BigNumber("0x5af3107a4000", 16),
      onChainFillPrice: new BigNumber("0x1500", 16),
      tickSize: new BigNumber("0.0001", 10),
    },
    mock: {
      contracts: {
        abi: {
          events: {
            Augur: {
              OrderFilled: {
                signature: "ORDER_FILLED_SIGNATURE",
              },
              OrderCreated: {
                signature: "ORDER_CREATED_SIGNATURE",
                inputs: orderFilledInputs,
              },
            },
          },
        },
      },
      ethrpc: {
        getTransactionReceipt: function (transactionHash, callback) {
          callback(null, {});
        },
      },
    },
    assertions: function (err, tradeOnChainAmountRemaining) {
      assert.strictEqual(err.message, "logs not found");
      assert.isUndefined(tradeOnChainAmountRemaining);
    },
  });
});
