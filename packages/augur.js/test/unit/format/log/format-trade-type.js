/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var formatTradeType = require("../../../../src/format/log/format-trade-type");

describe("format/log/format-trade-type", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(formatTradeType(t.orderType));
    });
  };
  test({
    orderType: "0x0",
    assertions: function (type) {
      assert.deepEqual(type, "buy");
    },
  });
  test({
    orderType: "0x1",
    assertions: function (type) {
      assert.deepEqual(type, "sell");
    },
  });
});
