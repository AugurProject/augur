/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var calculateNumTicks = require("../../../src/create-market/calculate-num-ticks");

describe("create-market/calculate-num-ticks", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(calculateNumTicks(t.params.tickSize, t.params.minPrice, t.params.maxPrice));
    });
  };
  test({
    description: "(0.0001, 0, 1) -> 10000",
    params: {
      tickSize: "0.0001",
      minPrice: "0",
      maxPrice: "1",
    },
    assertions: function (numTicks) {
      assert.strictEqual(numTicks, "10000");
    },
  });
  test({
    description: "(0.0001, -1, 2) -> 30000",
    params: {
      tickSize: "0.0001",
      minPrice: "-1",
      maxPrice: "2",
    },
    assertions: function (numTicks) {
      assert.strictEqual(numTicks, "30000");
    },
  });
  test({
    description: "(0.0125, -5, 1) -> 480",
    params: {
      tickSize: "0.0125",
      minPrice: "-5",
      maxPrice: "1",
    },
    assertions: function (numTicks) {
      assert.strictEqual(numTicks, "480");
    },
  });
});
