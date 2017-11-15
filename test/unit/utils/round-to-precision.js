/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var roundToPrecision = require("../../../src/utils/round-to-precision");

describe("utils/round-to-precision", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(roundToPrecision(t.value, t.minimum, t.round, t.roundingMode));
    });
  };
  test({
    value: new BigNumber("10.042383874392382392"),
    minimum: new BigNumber("15"),
    round: "ceil",
    roundingMode: "1",
    assertions: function (roundedValue) {
      assert.isNull(roundedValue);
    },
  });
  test({
    value: new BigNumber("0.00058472239302029387432"),
    minimum: new BigNumber("-15"),
    round: "ceil",
    roundingMode: BigNumber.ROUND_UP,
    assertions: function (roundedValue) {
      assert.deepEqual(roundedValue, "0.0005847");
    },
  });
  test({
    value: new BigNumber("0.0007889577234892349872349823403"),
    minimum: new BigNumber("0"),
    round: "floor",
    roundingMode: BigNumber.ROUND_DOWN,
    assertions: function (roundedValue) {
      assert.deepEqual(roundedValue, "0.0007889");
    },
  });
  test({
    value: new BigNumber("932.9238374636282823839223"),
    minimum: new BigNumber("0"),
    round: "ceil",
    roundingMode: BigNumber.ROUND_UP,
    assertions: function (roundedValue) {
      assert.deepEqual(roundedValue, "932.9239");
    },
  });
  test({
    value: new BigNumber("42.119238375652328232332124568"),
    minimum: new BigNumber("5"),
    round: "floor",
    roundingMode: BigNumber.ROUND_DOWN,
    assertions: function (roundedValue) {
      assert.deepEqual(roundedValue, "42.1192");
    },
  });
});
