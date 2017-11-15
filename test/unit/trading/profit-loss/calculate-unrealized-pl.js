/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var ZERO = require("../../../../src/constants").ZERO;

describe("trading/profit-loss/calculate-unrealized-pl", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(require("../../../../src/trading/profit-loss/calculate-unrealized-pl")(t.position, t.meanOpenPrice, t.lastTradePrice));
    });
  };
  test({
    position: null,
    meanOpenPrice: null,
    lastTradePrice: ZERO,
    assertions: function (out) {
      assert.deepEqual(out, ZERO);
    },
  });
});
