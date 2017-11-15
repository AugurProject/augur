/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var parseOrder = require("../../../src/parsers/order");

describe("parsers/order", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(parseOrder(t.params.type, t.params.minPrice, t.params.maxPrice, t.params.order));
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
    description: "zero order array",
    params: {
      type: 1,
      minPrice: "0",
      maxPrice: "1",
      order: ["0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0"],
    },
    assertions: function (output) {
      assert.isNull(output);
    },
  });
  test({
    description: "buy order",
    params: {
      type: 1,
      minPrice: "0",
      maxPrice: "1",
      order: [
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
      });
    },
  });
  test({
    description: "sell order",
    params: {
      type: 2,
      minPrice: "0",
      maxPrice: "1",
      order: [
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
      });
    },
  });
});
