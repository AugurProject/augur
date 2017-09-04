/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var insertIndexedLog = require("../../../../src/logs/insert-indexed-log");

var mockMakeOrderLogs = [{
  market: "MARKET_ADDRESS",
  sender: "SENDER_ADDRESS",
  orderType: "buy",
  fxpPrice: "0.7777777",
  fxpAmount: "1.1111111",
  outcome: "OUTCOME_ID",
  orderId: "0x0000000000000000000000000000000000000000000000000000000000000001",
  fxpTokensEscrowed: "0.8641974",
  fxpSharesEscrowed: "0",
  tradeGroupID: "0x000000000000000000000000000000000000000000000000000000000000002a"
}, {
  market: "MARKET_ADDRESS",
  sender: "SENDER_ADDRESS",
  orderType: "buy",
  fxpPrice: "0.7777777",
  fxpAmount: "1.1111111",
  outcome: "OUTCOME_ID",
  orderId: "0x000000000000000000000000000000000000000000000000000000000000000f",
  fxpTokensEscrowed: "0.8641974",
  fxpSharesEscrowed: "0",
  tradeGroupID: "0x000000000000000000000000000000000000000000000000000000000000002a"
}];

var mockOrderBook = {
  MARKET_ADDRESS: {
    OUTCOME_ID: {
      buy: [{
        market: "MARKET_ADDRESS",
        sender: "SENDER_ADDRESS",
        orderType: "buy",
        fxpPrice: "0.7777777",
        fxpAmount: "1.1111111",
        outcome: "OUTCOME_ID",
        orderId: "0x0000000000000000000000000000000000000000000000000000000000000001",
        fxpTokensEscrowed: "0.8641974",
        fxpSharesEscrowed: "0",
        tradeGroupID: "0x000000000000000000000000000000000000000000000000000000000000002a"
      }, {
        market: "MARKET_ADDRESS",
        sender: "SENDER_ADDRESS",
        orderType: "buy",
        fxpPrice: "0.7777777",
        fxpAmount: "1.1111111",
        outcome: "OUTCOME_ID",
        orderId: "0x000000000000000000000000000000000000000000000000000000000000000f",
        fxpTokensEscrowed: "0.8641974",
        fxpSharesEscrowed: "0",
        tradeGroupID: "0x000000000000000000000000000000000000000000000000000000000000002a"
      }]
    }
  }
};

describe("trading/order-book/get-account-order-book", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getAccountOrderBook = proxyquire("../../../../src/trading/order-book/get-account-order-book", {
        "../../logs/get-logs-chunked": t.stub.getLogsChunked
      });
      getAccountOrderBook(t.params.p, t.params.onChunkReceived, function (orderBook) {
        t.assertions(orderBook);
        done();
      });
    });
  };
  test({
    description: "get account order book for specified market, outcome, and order type",
    params: {
      p: {
        sender: "SENDER_ADDRESS",
        market: "MARKET_ADDRESS",
        outcome: "OUTCOME_ID",
        orderType: 1,
        fromBlock: 15,
        toBlock: 20
      },
      onChunkReceived: function (orderBookChunk) {
        assert.deepEqual(orderBookChunk, mockOrderBook);
      }
    },
    stub: {
      getLogsChunked: function (p, onChunkReceived, onComplete) {
        assert.deepEqual(p, {
          label: "MakeOrder",
          filter: {
            sender: "SENDER_ADDRESS",
            market: "MARKET_ADDRESS",
            outcome: "OUTCOME_ID",
            orderType: 1,
            fromBlock: 15,
            toBlock: 20
          },
          aux: {
            index: ["market", "outcome", "orderType"],
            mergedLogs: {}
          }
        });
        assert.isFunction(onChunkReceived);
        assert.isFunction(onComplete);
        mockMakeOrderLogs.forEach(function (mockMakeOrderLog) {
          insertIndexedLog(p.aux.mergedLogs, mockMakeOrderLog, p.aux.index);
        });
        onChunkReceived(p.aux.mergedLogs);
        onComplete(p.aux.mergedLogs);
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, mockOrderBook);
    }
  });
});
