/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache();

describe("trading/order-book/get-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var getOrder = proxyquire("../../../../src/trading/order-book/get-order", {
        "../../api": function () {
          return {
            OrdersFetcher: {
              getOrder: t.stub.api.OrdersFetcher.getOrder
            }
          };
        }
      });
      getOrder(t.params, t.assertions);
    });
  };
  test({
    description: "buy order",
    params: {
      _type: 1,
      _orderId: "0xa",
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      minPrice: "0",
      maxPrice: "1"
    },
    stub: {
      api: {
        OrdersFetcher: {
          getOrder: function (p, callback) {
            assert.deepEqual(p, {
              _type: 1,
              _market: "MARKET_ID",
              _outcome: "OUTCOME_ID",
              _orderId: "0xa"
            });
            callback([
              speedomatic.fix("1.1111111", "hex"), // amount
              speedomatic.fix("0.7777777", "hex"), // price
              "0xb0b",                     // owner
              speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
              speedomatic.fix("0", "hex"),         // sharesEscrowed
              "0xa",                       // betterOrderId
              "0xb",                       // worseOrderId
              "0x4a817c800"                // gasPrice
            ]);
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        amount: "1.1111",
        fullPrecisionAmount: "1.1111111",
        price: "0.7777",
        fullPrecisionPrice: "0.7777777",
        owner: "0x0000000000000000000000000000000000000b0b",
        tokensEscrowed: "0.8641974",
        sharesEscrowed: "0",
        betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
        worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
        gasPrice: "20000000000"
      });
    }
  });
  test({
    description: "order not found",
    params: {
      _type: 1,
      _orderId: "0xa",
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      minPrice: "0",
      maxPrice: "1"
    },
    stub: {
      api: {
        OrdersFetcher: {
          getOrder: function (p, callback) {
            assert.deepEqual(p, {
              _type: 1,
              _market: "MARKET_ID",
              _outcome: "OUTCOME_ID",
              _orderId: "0xa"
            });
            callback(["0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0"]);
          }
        }
      }
    },
    assertions: function (output) {
      assert.isNull(output);
    }
  });
  test({
    description: "missing minPrice and maxPrice values",
    params: {
      _type: 1,
      _orderId: "0xa",
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      minPrice: undefined,
      maxPrice: undefined
    },
    stub: {
      api: {
        OrdersFetcher: {
          getOrder: function () {
            assert.fail();
          }
        }
      }
    },
    assertions: function (output) {
      assert.strictEqual(output.error, "Must specify minPrice and maxPrice");
    }
  });
  test({
    description: "missing minPrice value",
    params: {
      _type: 1,
      _orderId: "0xa",
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      minPrice: null,
      maxPrice: "1"
    },
    stub: {
      api: {
        OrdersFetcher: {
          getOrder: function () {
            assert.fail();
          }
        }
      }
    },
    assertions: function (output) {
      assert.strictEqual(output.error, "Must specify minPrice and maxPrice");
    }
  });
  test({
    description: "missing maxPrice value",
    params: {
      _type: 1,
      _orderId: "0xa",
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      minPrice: "0",
      maxPrice: null
    },
    stub: {
      api: {
        OrdersFetcher: {
          getOrder: function () {
            assert.fail();
          }
        }
      }
    },
    assertions: function (output) {
      assert.strictEqual(output.error, "Must specify minPrice and maxPrice");
    }
  });
});
