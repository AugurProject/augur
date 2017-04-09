"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");

describe("slashRep.slashRep", function () {
  // 2 tests total
  var fixReport = augur.fixReport;
  var slashRep = augur.SlashRep.slashRep;
  afterEach(function () {
    augur.fixReport = fixReport;
    augur.SlashRep.slashRep = slashRep;
  });
  var test = function (t) {
    it(JSON.stringify(t), function () {
      augur.fixReport = t.fixReport;
      augur.SlashRep.slashRep = t.slashRep;
      augur.slashRep(t.branch, t.salt, t.report, t.reporter, t.eventID, t.minValue, t.maxValue, t.type, t.isIndeterminate, t.isUnethical, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    branch: "0xb1",
    salt: Buffer.from("This is some salty information"),
    report: abi.bignum("1"),
    reporter: "0x1",
    eventID: "0xe1",
    minValue: "1",
    maxValue: "2",
    type: "binary",
    isIndeterminate: false,
    isUnethical: false,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop,
    fixReport: function (report, minValue, maxValue, type, isIndeterminate) {
      return abi.fix(report, "hex");
    },
    slashRep: function (branch, salt, fixedReport, reporter, eventID, onSent, onSuccess, onFailed) {
      assert.deepEqual(branch, "0xb1");
      assert.deepEqual(salt, "0x5468697320697320736f6d652073616c747920696e666f726d6174696f6e");
      assert.deepEqual(fixedReport, "0xde0b6b3a7640000");
      assert.deepEqual(reporter, "0x1");
      assert.deepEqual(eventID, "0xe1");
      assert.deepEqual(onSent, noop);
      assert.deepEqual(onSuccess, noop);
      assert.deepEqual(onFailed, noop);
    }
  });
  test({
    branch: {
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
    fixReport: function (report, minValue, maxValue, type, isIndeterminate) {
      return abi.fix(report, "hex");
    },
    slashRep: function (branch, salt, fixedReport, reporter, eventID, onSent, onSuccess, onFailed) {
      assert.deepEqual(branch, "0xb1");
      assert.deepEqual(salt, "0x5468697320697320736f6d652073616c747920696e666f726d6174696f6e");
      assert.deepEqual(fixedReport, "0x1bc16d674ec80000");
      assert.deepEqual(reporter, "0x2");
      assert.deepEqual(eventID, "0xe2");
      assert.deepEqual(onSent, noop);
      assert.deepEqual(onSuccess, noop);
      assert.deepEqual(onFailed, noop);
    }
  });
});
