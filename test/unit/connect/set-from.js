/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var setFrom = require("../../../src/connect/set-from");

describe("connect/set-from", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(setFrom(t.params.functionsAbi, t.params.fromAddress));
    });
  };
  test({
    description: "set from fields in functions ABI",
    params: {
      functionsAbi: {
        contract1: { method1: { to: "0xc1" }, method2: { to: "0xc1" } },
        contract2: { method1: { to: "0xc2" } },
      },
      fromAddress: "0xb0b",
    },
    assertions: function (functionsAbi) {
      assert.deepEqual(functionsAbi, {
        contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
        contract2: { method1: { from: "0xb0b", to: "0xc2" } },
      });
    },
  });
  test({
    description: "change from fields in functions ABI",
    params: {
      functionsAbi: {
        contract1: { method1: { from: "0xd00d", to: "0xc1" }, method2: { from: "0xd00d", to: "0xc1" } },
        contract2: { method1: { from: "0xd00d", to: "0xc2" } },
      },
      fromAddress: "0xb0b",
    },
    assertions: function (functionsAbi) {
      assert.deepEqual(functionsAbi, {
        contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
        contract2: { method1: { from: "0xb0b", to: "0xc2" } },
      });
    },
  });
  test({
    description: "do not update functions ABI if fromAddress not provided",
    params: {
      functionsAbi: {
        contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
        contract2: { method1: { from: "0xb0b", to: "0xc2" } },
      },
      fromAddress: null,
    },
    assertions: function (functionsAbi) {
      assert.deepEqual(functionsAbi, {
        contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
        contract2: { method1: { from: "0xb0b", to: "0xc2" } },
      });
    },
  });
  test({
    description: "do nothing if no functions ABI provided",
    params: {
      functionsAbi: null,
      fromAddress: "0xb0b",
    },
    assertions: function (functionsAbi) {
      assert.isNull(functionsAbi);
    },
  });
});
