/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var proxyquire = require("proxyquire");

var callcount = 0;

describe("trading/order-book/get-order-book-chunked", function () {
  var test = function (t) {
    it(t.description, function () {
      callcount = 0;
      var getOrderBookChunked = proxyquire("../../../../src/trading/order-book/get-order-book-chunked", {
        "./get-order-book": t.stub.getOrderBook,
        "../../api": function () {
          return {
            Orders: {
              getWorseOrderId: t.stub.api.Orders.getWorseOrderId
            }
          }
        }
      });
      getOrderBookChunked(t.params.p, t.params.onChunkReceived, t.assertions);
    });
  };
  test({
    description: "2 orders, 1 chunk",
    params: {
      p: {
        _type: 2,
        _market: "MARKET_ID",
        _outcome: "OUTCOME_ID",
        _startingOrderId: "0xa",
        _numOrdersToLoad: 10,
        minPrice: "0",
        maxPrice: "1"
      },
      onChunkReceived: function (orderBookChunk) {
        assert.deepEqual(orderBookChunk, {
          "0x1": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000000"
          },
          "0xf": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000001"
          }
        });
      }
    },
    stub: {
      getOrderBook: function (p, callback) {
        assert.deepEqual(p, {
          _type: 2,
          _market: "MARKET_ID",
          _outcome: "OUTCOME_ID",
          _startingOrderId: "0xa",
          _numOrdersToLoad: 10,
          minPrice: "0",
          maxPrice: "1"
        });
        callback({
          "0x1": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000000"
          },
          "0xf": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000001"
          }
        }, "0xf");
      },
      api: {
        Orders: {
          getWorseOrderId: function (p, callback) {
            assert.deepEqual(p, {
              _orderId: "0xf",
              _type: 2,
              _market: "MARKET_ID",
              _outcome: "OUTCOME_ID"
            });
            callback("0x0");
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
          "0x1": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000000"
          },
          "0xf": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000001"
          }
        });
    }
  });
  test({
    description: "2 orders, 2 chunks",
    params: {
      p: {
        _type: 2,
        _market: "MARKET_ID",
        _outcome: "OUTCOME_ID",
        _startingOrderId: "0xa",
        _numOrdersToLoad: 1,
        minPrice: "0",
        maxPrice: "1"
      },
      onChunkReceived: function (orderBookChunk) {
        if (callcount === 1) {
          assert.deepEqual(orderBookChunk, {
            "0x1": {
              amount: "1.1111",
              fullPrecisionAmount: "1.1111111",
              price: "0.7778",
              fullPrecisionPrice: "0.7777777",
              owner: "0x0000000000000000000000000000000000000b0b",
              tokensEscrowed: "0.8641974",
              sharesEscrowed: "0",
              betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
              worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
              gasPrice: "20000000000"
            }
          });
        } else if (callcount === 2) {
          assert.deepEqual(orderBookChunk, {
            "0xf": {
              amount: "1.1111",
              fullPrecisionAmount: "1.1111111",
              price: "0.7778",
              fullPrecisionPrice: "0.7777777",
              owner: "0x0000000000000000000000000000000000000b0b",
              tokensEscrowed: "0.8641974",
              sharesEscrowed: "0",
              betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
              worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
              gasPrice: "20000000001"
            }
          });
        } else {
          assert.fail();
        }
      }
    },
    stub: {
      getOrderBook: function (p, callback) {
        callcount++;
        if (callcount === 1) {
          assert.deepEqual(p, {
            _type: 2,
            _market: "MARKET_ID",
            _outcome: "OUTCOME_ID",
            _startingOrderId: "0xa",
            _numOrdersToLoad: 1,
            minPrice: "0",
            maxPrice: "1"
          });
          callback({
            "0x1": {
              amount: "1.1111",
              fullPrecisionAmount: "1.1111111",
              price: "0.7778",
              fullPrecisionPrice: "0.7777777",
              owner: "0x0000000000000000000000000000000000000b0b",
              tokensEscrowed: "0.8641974",
              sharesEscrowed: "0",
              betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
              worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
              gasPrice: "20000000000"
            }
          }, "0xa");
        } else if (callcount === 2) {
          assert.deepEqual(p, {
            _type: 2,
            _market: "MARKET_ID",
            _outcome: "OUTCOME_ID",
            _startingOrderId: "0xf",
            _numOrdersToLoad: 1,
            minPrice: "0",
            maxPrice: "1"
          });
          callback({
            "0xf": {
              amount: "1.1111",
              fullPrecisionAmount: "1.1111111",
              price: "0.7778",
              fullPrecisionPrice: "0.7777777",
              owner: "0x0000000000000000000000000000000000000b0b",
              tokensEscrowed: "0.8641974",
              sharesEscrowed: "0",
              betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
              worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
              gasPrice: "20000000001"
            }
          }, "0xf");
        } else {
          assert.fail();
        }
      },
      api: {
        Orders: {
          getWorseOrderId: function (p, callback) {
            if (callcount === 1) {
              assert.deepEqual(p, {
                _orderId: "0xa",
                _type: 2,
                _market: "MARKET_ID",
                _outcome: "OUTCOME_ID"
              });
              callback("0xf");
            } else if (callcount === 2) {
              assert.deepEqual(p, {
                _orderId: "0xf",
                _type: 2,
                _market: "MARKET_ID",
                _outcome: "OUTCOME_ID"
              });
              callback("0x0");
            } else {
              assert.fail();
            }
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
          "0x1": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000000"
          },
          "0xf": {
            amount: "1.1111",
            fullPrecisionAmount: "1.1111111",
            price: "0.7778",
            fullPrecisionPrice: "0.7777777",
            owner: "0x0000000000000000000000000000000000000b0b",
            tokensEscrowed: "0.8641974",
            sharesEscrowed: "0",
            betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
            worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
            gasPrice: "20000000001"
          }
        });
    }
  });
});
