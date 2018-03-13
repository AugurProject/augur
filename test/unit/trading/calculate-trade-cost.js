/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var calculateTradeCost = require("../../../src/trading/calculate-trade-cost");

describe("trading/calculate-trade-cost", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(calculateTradeCost(t.params));
    });
  };
  test({
    description: "scalar bid",
    params: {
      displayPrice: "20",
      displayAmount: "0.002",
      orderType: 0,
      minDisplayPrice: "-10",
      maxDisplayPrice: "120",
      numTicks: "1300",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "60000000000000000");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "200000000000000");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "300");
    },
  });
  test({
    description: "scalar ask",
    params: {
      displayPrice: "20",
      displayAmount: "0.002",
      orderType: 1,
      minDisplayPrice: "-10",
      maxDisplayPrice: "120",
      numTicks: "1300",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "200000000000000000");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "200000000000000");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "300");
    },
  });
  test({
    description: "binary bid",
    params: {
      displayPrice: "0.75",
      displayAmount: "0.1",
      orderType: 0,
      minDisplayPrice: "0",
      maxDisplayPrice: "1",
      numTicks: "10000",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "75000000000000000");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "10000000000000");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "7500");
    },
  });
  test({
    description: "binary ask",
    params: {
      displayPrice: "0.75",
      displayAmount: "0.1",
      orderType: 1,
      minDisplayPrice: "0",
      maxDisplayPrice: "1",
      numTicks: "10000",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "25000000000000000");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "10000000000000");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "7500");
    },
  });
  test({
    description: "3-outcome categorical bid",
    params: {
      displayPrice: "0.75",
      displayAmount: "0.1",
      orderType: 0,
      minDisplayPrice: "0",
      maxDisplayPrice: "1",
      numTicks: "10002",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "75004999000199961");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "9998000399920");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "7502");
    },
  });
  test({
    description: "3-outcome categorical ask",
    params: {
      displayPrice: "0.75",
      displayAmount: "0.1",
      orderType: 1,
      minDisplayPrice: "0",
      maxDisplayPrice: "1",
      numTicks: "10002",
    },
    assertions: function (tradeCost) {
      assert.strictEqual(tradeCost.cost.toFixed(), "25004999000199961");
      assert.strictEqual(tradeCost.onChainAmount.toFixed(), "9998000399920");
      assert.strictEqual(tradeCost.onChainPrice.toFixed(), "7501");
    },
  });
});
