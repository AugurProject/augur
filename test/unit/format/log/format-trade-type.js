/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var formatTradeType = require("../../../../src/format/log/format-trade-type");

describe("formatTradeType", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(formatTradeType(t.type));
    });
  };
  test({
    type: "0x1",
    assertions: function (type) {
      assert.deepEqual(type, "buy");
    }
  });
  test({
    type: "1",
    assertions: function (type) {
      assert.deepEqual(type, "buy");
    }
  });
  test({
    type: 1,
    assertions: function (type) {
      assert.deepEqual(type, "buy");
    }
  });
  test({
    type: "0x2",
    assertions: function (type) {
      assert.deepEqual(type, "sell");
    }
  });
  test({
    type: "2",
    assertions: function (type) {
      assert.deepEqual(type, "sell");
    }
  });
  test({
    type: 2,
    assertions: function (type) {
      assert.deepEqual(type, "sell");
    }
  });
});
