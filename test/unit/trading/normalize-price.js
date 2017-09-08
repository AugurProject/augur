/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var normalizePrice = require("../../../src/trading/normalize-price");

describe("trading/normalize-price", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(normalizePrice(t.params.minValue, t.params.maxValue, t.params.displayPrice));
    });
  };
  test({
    description: "display price 0.4 on [0, 1] should normalize to 0.4",
    params: {
      minValue: "0",
      maxValue: "1",
      displayPrice: "0.4"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.4");
    }
  });
  test({
    description: "display price 0 on [0, 1] should normalize to 0",
    params: {
      minValue: "0",
      maxValue: "1",
      displayPrice: "0"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0");
    }
  });
  test({
    description: "display price 1 on [0, 1] should normalize to 1",
    params: {
      minValue: "0",
      maxValue: "1",
      displayPrice: "1"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "1");
    }
  });
  test({
    description: "display price 0.4 on [0, 2] should normalize to 0.2",
    params: {
      minValue: "0",
      maxValue: "2",
      displayPrice: "0.4"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.2");
    }
  });
  test({
    description: "display price 0.4 on [-1, 1] should normalize to 0.7",
    params: {
      minValue: "-1",
      maxValue: "1",
      displayPrice: "0.4"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.7");
    }
  });
  test({
    description: "display price 0 on [-1, 1] should normalize to 0.5",
    params: {
      minValue: "-1",
      maxValue: "1",
      displayPrice: "0"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.5");
    }
  });
  test({
    description: "display price -1 on [-1, 1] should normalize to 0",
    params: {
      minValue: "-1",
      maxValue: "1",
      displayPrice: "-1"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0");
    }
  });
  test({
    description: "display price -1.4 on [-5, -1] should normalize to 0.9",
    params: {
      minValue: "-5",
      maxValue: "-1",
      displayPrice: "-1.4"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "0.9");
    }
  });
  test({
    description: "display price -1 on [-5, -1] should normalize to 1",
    params: {
      minValue: "-5",
      maxValue: "-1",
      displayPrice: "-1"
    },
    assertions: function (normalizedPrice) {
      assert.strictEqual(normalizedPrice, "1");
    }
  });
});
