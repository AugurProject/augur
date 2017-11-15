/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var normalizePrice = require("../../../src/trading/normalize-price");

describe("trading/normalize-price", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(normalizePrice(t.params));
    });
  };
  test({
    description: "display price 0.4 on [0, 1] should normalize to 0.4",
    params: {
      minPrice: "0",
      maxPrice: "1",
      price: "0.4",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.4");
    },
  });
  test({
    description: "display price 0 on [0, 1] should normalize to 0",
    params: {
      minPrice: "0",
      maxPrice: "1",
      price: "0",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0");
    },
  });
  test({
    description: "display price 1 on [0, 1] should normalize to 1",
    params: {
      minPrice: "0",
      maxPrice: "1",
      price: "1",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "1");
    },
  });
  test({
    description: "display price 0.4 on [0, 2] should normalize to 0.2",
    params: {
      minPrice: "0",
      maxPrice: "2",
      price: "0.4",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.2");
    },
  });
  test({
    description: "display price 0.4 on [-1, 1] should normalize to 0.7",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      price: "0.4",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.7");
    },
  });
  test({
    description: "display price 0 on [-1, 1] should normalize to 0.5",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      price: "0",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.5");
    },
  });
  test({
    description: "display price -1 on [-1, 1] should normalize to 0",
    params: {
      minPrice: "-1",
      maxPrice: "1",
      price: "-1",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0");
    },
  });
  test({
    description: "display price -1.4 on [-5, -1] should normalize to 0.9",
    params: {
      minPrice: "-5",
      maxPrice: "-1",
      price: "-1.4",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.9");
    },
  });
  test({
    description: "display price -1 on [-5, -1] should normalize to 1",
    params: {
      minPrice: "-5",
      maxPrice: "-1",
      price: "-1",
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "1");
    },
  });
});
