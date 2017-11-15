/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var denormalizePrice = require("../../../src/trading/denormalize-price");

describe("trading/denormalize-price", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(denormalizePrice(t.params));
    });
  };
  test({
    description: "normalized price 0.4 on [0, 1] should convert to display price of 0.4",
    params: {
      minPrice: "0",
      maxPrice: "1",
      normalizedPrice: "0.4",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "0.4");
    },
  });
  test({
    description: "normalized price 0 on [0, 1] should convert to display price of 0",
    params: {
      minPrice: "0",
      maxPrice: "1",
      normalizedPrice: "0",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "0");
    },
  });
  test({
    description: "normalized price 1 on [0, 1] should convert to display price of 1",
    params: {
      minPrice: "0",
      maxPrice: "1",
      normalizedPrice: "1",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "1");
    },
  });
  test({
    description: "normalized price 0.2 on [0, 2] should convert to display price of 0.4",
    params: {
      minPrice: "0",
      maxPrice: "2",
      normalizedPrice: "0.2",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "0.4");
    },
  });
  test({
    description: "normalized price 0.7 on [-1, 1] should convert to display price of 0.4",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      normalizedPrice: "0.7",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "0.4");
    },
  });
  test({
    description: "normalized price 0.5 on [-1, 1] should convert to display price of 0",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      normalizedPrice: "0.5",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "0");
    },
  });
  test({
    description: "normalized price 0 on [-1, 1] should convert to display price of -1",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      normalizedPrice: "0",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "-1");
    },
  });
  test({
    description: "normalized price 0.9 on [-5, -1] should convert to display price of -1.4",
    params: {
      minPrice: "-5",
      maxPrice: "-1",
      normalizedPrice: "0.9",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "-1.4");
    },
  });
  test({
    description: "normalized price 1 on [-5, -1] should convert to display price of -1",
    params: {
      minPrice: "-5",
      maxPrice: "-1",
      normalizedPrice: "1",
    },
    assertions: function (displayPrice) {
      assert.strictEqual(displayPrice, "-1");
    },
  });
});
