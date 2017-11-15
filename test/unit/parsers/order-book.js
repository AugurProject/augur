/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var parseOrderBook = require("../../../src/parsers/order-book");

describe("parsers/order-book", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(parseOrderBook(t.params.type, t.params.minPrice, t.params.maxPrice, t.params.orderBookArray));
    });
  };
  test({
    description: "null order",
    params: {
      type: 1,
      minPrice: "0",
      maxPrice: "1",
      order: null,
    },
    assertions: function (output) {
      assert.isNull(output);
    },
  });
  test({
    description: "empty order",
    params: {
      type: 1,
      minPrice: "0",
      maxPrice: "1",
      order: [],
    },
    assertions: function (output) {
      assert.isNull(output);
    },
  });
  test({
    description: "single order",
    params: {
      type: 1,
      minPrice: "0",
      maxPrice: "1",
      orderBookArray: [
        "0x1",                       // orderId
        speedomatic.fix("1.1111111", "hex"), // amount
        speedomatic.fix("0.7777777", "hex"), // price
        "0xb0b",                     // owner
        speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
        speedomatic.fix("0", "hex"),         // sharesEscrowed
        "0xa",                       // betterOrderId
        "0xb",                       // worseOrderId
        "0x4a817c800",                // gasPrice
      ],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x1": {
          amount: "1.1111",
          fullPrecisionAmount: "1.1111111",
          price: "0.7777",
          fullPrecisionPrice: "0.7777777",
          owner: "0x0000000000000000000000000000000000000b0b",
          tokensEscrowed: "0.8641974",
          sharesEscrowed: "0",
          betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
          worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
          gasPrice: "20000000000",
        },
      });
    },
  });
  test({
    description: "two orders",
    params: {
      type: 2,
      minPrice: "0",
      maxPrice: "1",
      orderBookArray: [
        "0x1",                       // orderId
        speedomatic.fix("1.1111111", "hex"), // amount
        speedomatic.fix("0.7777777", "hex"), // price
        "0xb0b",                     // owner
        speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
        speedomatic.fix("0", "hex"),         // sharesEscrowed
        "0xa",                       // betterOrderId
        "0xb",                       // worseOrderId
        "0x4a817c800",               // gasPrice

        "0xf",                       // orderId
        speedomatic.fix("1.1111111", "hex"), // amount
        speedomatic.fix("0.7777777", "hex"), // price
        "0xb0b",                     // owner
        speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
        speedomatic.fix("0", "hex"),         // sharesEscrowed
        "0xa",                       // betterOrderId
        "0xb",                       // worseOrderId
        "0x4a817c801",                // gasPrice
      ],
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
          gasPrice: "20000000000",
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
          gasPrice: "20000000001",
        },
      });
    },
  });
});
