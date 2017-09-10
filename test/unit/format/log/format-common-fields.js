/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var formatCommonFields = require("../../../../src/format/log/format-common-fields");

describe("formatCommonFields", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(formatCommonFields(t.msg));
    });
  };
  test({
    msg: {
      sender: "0x1",
      timestamp: 15000000,
      orderType: 0,
      price: "500000000000000000",
      amount: "10000000000000000000"
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        sender: "0x0000000000000000000000000000000000000001",
        timestamp: 352321536,
        orderType: "buy",
        price: "0.5",
        amount: "10"
      });
    }
  });
  test({
    msg: {
      sender: "0x2",
      timestamp: 15000000,
      orderType: "1",
      price: "750000000000000000",
      amount: "25000000000000000000"
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        sender: "0x0000000000000000000000000000000000000002",
        timestamp: 352321536,
        orderType: "sell",
        price: "0.75",
        amount: "25"
      });
    }
  });
});
