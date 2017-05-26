"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");

describe("augur.reporting.slashRep", function () {
  // 1 tests total
  var slashRep = augur.api.SlashRep.slashRep;
  afterEach(function () {
    augur.api.SlashRep.slashRep = slashRep;
  });
  var test = function (t) {
    it(JSON.stringify(t), function () {
      augur.api.SlashRep.slashRep = t.slashRep;
      augur.reporting.slashRep(t.params);
    });
  };
  test({
    params: {
      branch: "0xb1",
      salt: Buffer.from("This is some salty information"),
      report: abi.bignum("2"),
      reporter: "0x2",
      eventID: "0xe2",
      minValue: "1",
      maxValue: "2",
      type: "binary",
      isIndeterminate: false,
      isUnethical: false,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    slashRep: function (p) {
      assert.deepEqual(p.branch, "0xb1");
      assert.deepEqual(p.salt, "0x5468697320697320736f6d652073616c747920696e666f726d6174696f6e");
      assert.deepEqual(p.report, "0x1bc16d674ec80000");
      assert.deepEqual(p.reporter, "0x2");
      assert.deepEqual(p.eventID, "0xe2");
      assert.deepEqual(p.minValue, '1');
      assert.deepEqual(p.maxValue, '2');
      assert.deepEqual(p.type, 'binary');
      assert.deepEqual(p.isIndeterminate, false);
      assert.deepEqual(p.isUnethical, false);
      assert.deepEqual(p.onSent, noop);
      assert.deepEqual(p.onSuccess, noop);
      assert.deepEqual(p.onFailed, noop);
    }
  });
});
