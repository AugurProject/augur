/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var fix = require("./utils").fix;

describe("trading/positions/modify-position", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/modify-position")(t.typeCode, t.position, t.numShares));
    });
  };
  test({
    description: "buy 1 share, no position",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
    position: new BigNumber("0"),
    numShares: fix("1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("1", 10));
    }
  });
  test({
    description: "buy 1 share, position 1",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
    position: new BigNumber("1", 10),
    numShares: fix("1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("2", 10));
    }
  });
  test({
    description: "buy 0.1 share, position 0.2",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
    position: new BigNumber("0.2", 10),
    numShares: fix("0.1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("0.3", 10));
    }
  });
  test({
    description: "buy 0.2 shares, position 123.4567",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
    position: new BigNumber("123.4567", 10),
    numShares: fix("0.2"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("123.6567", 10));
    }
  });
  test({
    description: "buy 123.4567 shares, position 0.2",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
    position: new BigNumber("0.2", 10),
    numShares: fix("123.4567"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("123.6567", 10));
    }
  });
  test({
    description: "sell 1 share, position 0",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
    position: new BigNumber("0"),
    numShares: fix("1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("-1", 10));
    }
  });
  test({
    description: "sell 1 share, position 1",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
    position: new BigNumber("1", 10),
    numShares: fix("1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("0"));
    }
  });
  test({
    description: "sell 0.1 share, position 0.2",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
    position: new BigNumber("0.2", 10),
    numShares: fix("0.1"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("0.1", 10));
    }
  });
  test({
    description: "sell 0.2 shares, position 123.4567",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
    position: new BigNumber("123.4567", 10),
    numShares: fix("0.2"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("123.2567", 10));
    }
  });
  test({
    description: "sell 123.4567 shares, position 0.2",
    typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
    position: new BigNumber("0.2", 10),
    numShares: fix("123.4567"),
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("-123.2567", 10));
    }
  });
});
