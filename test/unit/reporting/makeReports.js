"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var constants = require("../../../src/constants");
var noop = require("../../../src/utils/noop");
var augur = new (require("../../../src"))();

describe("unfixConsensusOutcome", function () {
  var test = function (t) {
    it(t.description, function () {
      var unfixConsensusOutcome = require('../../../src/reporting/format/unfix-consensus-outcome');
      t.assertions(unfixConsensusOutcome(t.params.fxpReport, t.params.minValue, t.params.maxValue, t.params.type));
    });
  };
  test({
    description: "binary event: consensus outcome 1",
    params: {
      fxpReport: "0xde0b6b3a7640000",
      minValue: "1",
      maxValue: "2",
      type: "binary"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "1",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "binary event: consensus outcome 2",
    params: {
      fxpReport: "0x1bc16d674ec80000",
      minValue: "1",
      maxValue: "2",
      type: "binary"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "2",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "binary event: consensus outcome 1.5 (indeterminate)",
    params: {
      fxpReport: "0x14d1120d7b160000",
      minValue: "1",
      maxValue: "2",
      type: "binary"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "1.5",
        isIndeterminate: true
      });
    }
  });
  test({
    description: "categorical event: consensus outcome 1",
    params: {
      fxpReport: "0xde0b6b3a7640000",
      minValue: "1",
      maxValue: "6",
      type: "categorical"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "1",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "categorical event: consensus outcome 5",
    params: {
      fxpReport: "0x4563918244f40000",
      minValue: "1",
      maxValue: "6",
      type: "categorical"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "5",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "categorical event: consensus outcome 3.5 (indeterminate)",
    params: {
      fxpReport: "0x30927f74c9de0000",
      minValue: "1",
      maxValue: "6",
      type: "categorical"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "3.5",
        isIndeterminate: true
      });
    }
  });
  test({
    description: "categorical event: consensus outcome 3.5 (determinate)",
    params: {
      fxpReport: "0x30927f74c9de0001",
      minValue: "1",
      maxValue: "6",
      type: "categorical"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "3.5",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome 1",
    params: {
      fxpReport: "0xde0b6b3a7640000",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "1",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome 2",
    params: {
      fxpReport: "0x1bc16d674ec80000",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "2",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome -2.5 (indeterminate)",
    params: {
      fxpReport: "-0x22b1c8c1227a0000",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "-2.5",
        isIndeterminate: true
      });
    }
  });
  test({
    description: "scalar event: consensus outcome -2.5 (determinate)",
    params: {
      fxpReport: "-0x22b1c8c12279ffff",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "-2.5",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome 0.000000000000000001",
    params: {
      fxpReport: "0x1",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "0",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome -3.1415",
    params: {
      fxpReport: "-0x2b98d99b09e3c000",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "-3.1415",
        isIndeterminate: false
      });
    }
  });
  test({
    description: "scalar event: consensus outcome -3.1415",
    params: {
      fxpReport: "0xffffffffffffffffffffffffffffffffffffffffffffffffd4672664f61c4000",
      minValue: "-10",
      maxValue: "5",
      type: "scalar"
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        outcomeID: "-3.1415",
        isIndeterminate: false
      });
    }
  });
});

describe("fixReport / unfixReport", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var fixReport = require('../../../src/reporting/format/fix-report');
      var unfixReport = require('../../../src/reporting/format/unfix-report');

      var testFixedReport = fixReport(
        t.report,
        t.minValue || "1",
        t.maxValue || "2",
        t.type,
        t.isIndeterminate
      );

      assert.strictEqual(testFixedReport, t.expected);

      var testUnfixReport = unfixReport(testFixedReport, t.minValue, t.maxValue, t.type);

      assert.strictEqual(testUnfixReport.report, t.report);
      assert.strictEqual(testUnfixReport.isIndeterminate, !!t.isIndeterminate);
    });
  };
  test({
    report: "1",
    type: "binary",
    isIndeterminate: false,
    expected: "0xde0b6b3a7640000"
  });
  test({
    report: "1",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: false,
    expected: "0xde0b6b3a7640000"
  });
  test({
    report: "1.23",
    minValue: "0",
    maxValue: "10",
    type: "scalar",
    isIndeterminate: false,
    expected: "0x1b4fbd92b5f8000"
  });
  test({
    report: "1",
    minValue: "1",
    maxValue: "8",
    type: "categorical",
    isIndeterminate: false,
    expected: "0x1"
  });
  test({
    report: "2",
    minValue: "1",
    maxValue: "8",
    type: "categorical",
    isIndeterminate: false,
    expected: "0x1fb87d085a09249"
  });
  test({
    report: "3",
    minValue: "1",
    maxValue: "8",
    type: "categorical",
    isIndeterminate: false,
    expected: "0x3f70fa10b412492"
  });
  test({
    report: "4",
    minValue: "1",
    maxValue: "8",
    type: "categorical",
    isIndeterminate: false,
    expected: "0x5f2977190e1b6db"
  });
  test({
    report: "8",
    minValue: "1",
    maxValue: "8",
    type: "categorical",
    isIndeterminate: false,
    expected: abi.fix("1", "hex")
  });
  test({
    report: "-5",
    minValue: "-5",
    maxValue: "20",
    type: "categorical",
    isIndeterminate: false,
    expected: "0x1"
  });
  test({
    report: "-4",
    minValue: "-5",
    maxValue: "20",
    type: "categorical",
    isIndeterminate: false,
    expected: abi.fix("0.04", "hex")
  });
  test({
    report: "0",
    minValue: "-5",
    maxValue: "20",
    type: "categorical",
    isIndeterminate: false,
    expected: abi.fix("0.2", "hex")
  });
  test({
    report: "10",
    minValue: "-5",
    maxValue: "20",
    type: "categorical",
    isIndeterminate: false,
    expected: abi.fix("0.6", "hex")
  });
  test({
    report: "20",
    minValue: "-5",
    maxValue: "20",
    type: "categorical",
    isIndeterminate: false,
    expected: abi.fix("1", "hex")
  });
  test({
    report: "1.5",
    type: "binary",
    isIndeterminate: true,
    expected: abi.hex(constants.BINARY_INDETERMINATE)
  });
  test({
    report: "0.5",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: true,
    expected: abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE)
  });
  test({
    report: "0.5",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: false,
    expected: abi.hex(constants.INDETERMINATE_PLUS_ONE)
  });
  test({
    report: "0.5",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: false,
    expected: abi.hex(constants.INDETERMINATE_PLUS_ONE)
  });
  test({
    report: "1.5",
    minValue: "0",
    maxValue: "1",
    type: "binary",
    isIndeterminate: true,
    expected: abi.hex(constants.BINARY_INDETERMINATE)
  });
  test({
    report: "0.5",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: true,
    expected: abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE)
  });
  test({
    report: "0",
    type: "binary",
    isIndeterminate: false,
    expected: "0x0"
  });
  test({
    report: "0",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: false,
    expected: "0x1"
  });
  test({
    report: "0.5",
    minValue: "0",
    maxValue: "1",
    type: "scalar",
    isIndeterminate: true,
    expected: abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE)
  });
});

describe("Report encryption/decryption", function () {
  var fixReport = require('../../../src/reporting/format/fix-report');
  var test = function (t) {
    it("encryptReport(" + t.report + "," + t.key + "," + t.salt + ") -> " + t.encryptedReport, function () {
      var encryptReport = require('../../../src/reporting/crypto/encrypt-report');
      assert.strictEqual(encryptReport(t.report, t.key, t.salt), t.encryptedReport);
    });
    it("decryptReport(" + t.encryptedReport + "," + t.key + "," + t.salt + ") -> " + t.report, function () {
      var decryptReport = require('../../../src/reporting/crypto/decrypt-report');
      assert.strictEqual(decryptReport(t.encryptedReport, t.key, t.salt), abi.format_int256(t.report));
    });
  };
  test({
    report: fixReport("1.5", 1, 2, "binary", true),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902b23ae675b8a18014"
  });
  test({
    report: fixReport("0.5", 1, 4, "scalar", true),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058014"
  });
  test({
    report: fixReport("0.5", 1, 4, "categorical", true),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058014"
  });
  test({
    report: fixReport(1, 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
  });
  test({
    report: fixReport("0x1", 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
  });
  test({
    report: fixReport("1", 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
  });
  test({
    report: fixReport(0, 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
  });
  test({
    report: fixReport("0x0", 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
  });
  test({
    report: fixReport("0", 1, 2, "binary"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar"),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058015"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar", true),
    key: "0x1",
    salt: "0x1",
    encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058014"
  });
  test({
    report: fixReport(1, 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
  });
  test({
    report: fixReport("0x1", 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
  });
  test({
    report: fixReport("1", 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
  });
  test({
    report: fixReport(0, 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
  });
  test({
    report: fixReport("0x0", 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
  });
  test({
    report: fixReport("0", 1, 2, "binary"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar"),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe4e3e81d55fded1c"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar", true),
    key: "0x1",
    encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe4e3e81d55fded1d"
  });
  test({
    report: fixReport(1, 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
  });
  test({
    report: fixReport("0x1", 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
  });
  test({
    report: fixReport("1", 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
  });
  test({
    report: fixReport(0, 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
  });
  test({
    report: fixReport("0x0", 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
  });
  test({
    report: fixReport("0", 1, 2, "binary"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar"),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ece6c4c808ff11442"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar", true),
    key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ece6c4c808ff11443"
  });
  test({
    report: fixReport(1, 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
  });
  test({
    report: fixReport("0x1", 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
  });
  test({
    report: fixReport("1", 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
  });
  test({
    report: fixReport(0, 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
  });
  test({
    report: fixReport("0x0", 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
  });
  test({
    report: fixReport("0", 1, 2, "binary"),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar", false),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660a4d148c75f3261a"
  });
  test({
    report: fixReport("0.5", 0, 1, "scalar", true),
    key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
    salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
    encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660a4d148c75f3261b"
  });
});

describe("makeHash", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var makeHash = require('../../../src/reporting/crypto/make-hash');
      assert.strictEqual(makeHash(t.salt, t.report, t.event, t.from, t.isScalar, t.isIndeterminate), t.expected);
    });
  };
  test({
    salt: "1337",
    report: "0xde0b6b3a7640000",
    from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
    expected: "0x213e934956a160e03cba5ec2f7837c633e0bb6b23976e986ed9a72ddb7ff0502"
  });
  test({
    salt: "1337",
    report: abi.hex(constants.BINARY_INDETERMINATE),
    from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
    expected: "0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c"
  });
  test({
    salt: "1337",
    report: abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE),
    from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
    expected: "0x43c678db38cdc86f109f0c8cccebf300b9fec908dd59ac905191b9c755e26c0a"
  });
  test({
    salt: "1337",
    report: abi.hex(constants.INDETERMINATE_PLUS_ONE),
    from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
    expected: "0xd8566eb441e5a90f035b72cb3fbd44d783f627b9d1503f5a2bfce7fab5853685"
  });
});

describe("parseAndDecryptReport", function () {
  var fixReport = require('../../../src/reporting/format/fix-report');
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var parseAndDecryptReport = require('../../../src/reporting/crypto/parse-and-decrypt-report');
      t.assertions(parseAndDecryptReport(t.arr, t.secret));
    });
  };
  test({
    arr: ['0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e', '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a6497847355b964e27'],
    secret: { derivedKey: '0xabc123', salt: '0x123abc456'},
    assertions: function (report) {
      assert.deepEqual(report, {
        salt: abi.prefix_hex(abi.pad_left(abi.hex('1337'))),
        report: abi.prefix_hex(abi.pad_left(fixReport('1', 1, 2, 'binary'))),
      	ethics: false
      });
    }
  });
  test({
    arr: ['0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e', '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a6497847355b964e27', '1'],
    secret: { derivedKey: '0xabc123', salt: '0x123abc456'},
    assertions: function (report) {
      assert.deepEqual(report, {
        salt: abi.prefix_hex(abi.pad_left(abi.hex('1337'))),
        report: abi.prefix_hex(abi.pad_left(fixReport('1', 1, 2, 'binary'))),
      	ethics: '1'
      });
    }
  });
  test({
    arr: ['0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014'],
    secret: { derivedKey: '0x1', salt: '0x1'},
    assertions: function (report) {
      assert.isNull(report);
    }
  });
  test({
    arr: '',
    secret: { derivedKey: '0x1', salt: '0x1'},
    assertions: function (report) {
      assert.isNull(report);
    }
  });
  test({
    arr: undefined,
    secret: { derivedKey: '0x1', salt: '0x1'},
    assertions: function (report) {
      assert.isNull(report);
    }
  });
});

describe("getAndDecryptReport", function () {
  var finished;
  var getEncryptedReport = augur.api.ExpiringEvents.getEncryptedReport;
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;

      augur.api.ExpiringEvents.getEncryptedReport = t.getEncryptedReport;

      var getAndDecryptReport = proxyquire('../../../src/reporting/crypto/get-and-decrypt-report', {
        './parse-and-decrypt-report': t.parseAndDecryptReport
      });

      getAndDecryptReport(t.params, t.callback);

      augur.api.ExpiringEvents.getEncryptedReport = getEncryptedReport;
    });
  };
  test({
    params: {
      branch: '0xb1',
      expDateIndex: 150000000,
      reporter: '0x1',
      event: '0xe1',
      secret: { derivedKey: '0xabc123', salt: '0x123abc456' },
    },
    callback: function (result) {
      assert.deepEqual(result, {
        salt: '0x123abc456',
        report: '0x1',
        ethics: false
      });
      finished();
    },
    getEncryptedReport: function(p, cb) {
      assert.deepEqual(p, {
        branch: '0xb1',
        expDateIndex: 150000000,
        reporter: '0x1',
        event: '0xe1',
      });
      cb(['0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e', '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a6497847355b964e27']);
    },
    parseAndDecryptReport: function(arr, secret) {
      assert.deepEqual(arr, ['0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e', '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a6497847355b964e27']);
      assert.deepEqual(secret, { derivedKey: '0xabc123', salt: '0x123abc456' });
      return {
        salt: '0x123abc456',
        report: '0x1',
        ethics: false
      };
    }
  });
  test({
    params: {
      branch: '0xb1',
      expDateIndex: 150000000,
      reporter: '0x1',
      event: '0xe1',
      secret: { derivedKey: '0xabc123', salt: '0x123abc456' },
    },
    callback: function (result) {
      assert.deepEqual(result, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getEncryptedReport: function(p, cb) {
      assert.deepEqual(p, {
        branch: '0xb1',
        expDateIndex: 150000000,
        reporter: '0x1',
        event: '0xe1',
      });
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    parseAndDecryptReport: function(arr, secret) {
      // shouldn't get hit in this scenario
      assert.isTrue(false);
    }
  });
});

describe("submitReportHash", function () {
  var finished;
  var apiSubmitReportHash = augur.api.MakeReports.submitReportHash;
  var getRepRedistributionDone = augur.api.ConsensusData.getRepRedistributionDone;
  var getReportHash = augur.api.ExpiringEvents.getReportHash;
  var submitReportHashCC = 0;

  var test = function (t) {
    it(JSON.stringify(t.params), function (done) {
      submitReportHashCC = 0;
      finished = done;

      var submitReportHash = proxyquire('../../../src/reporting/submit-report-hash', {
        './get-current-period-progress': t.getCurrentPeriodProgress,
        './prepare-to-report': t.prepareToReport
      });
      augur.api.MakeReports.submitReportHash = t.submitReportHash;
      augur.api.ConsensusData.getRepRedistributionDone = t.getRepRedistributionDone;
      augur.api.ExpiringEvents.getReportHash = t.getReportHash;

      submitReportHash(t.params);

      augur.api.MakeReports.submitReportHash = apiSubmitReportHash;
      augur.api.ConsensusData.getRepRedistributionDone = getRepRedistributionDone;
      augur.api.ExpiringEvents.getReportHash = getReportHash;
    });
  };
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e',
      encryptedSalt: '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c',
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: noop,
      onFailed: function (err) {
        assert.deepEqual(err, {"-2": "not in first half of period (commit phase)"});
        finished();
      }
    },
    submitReportHash: function (p) {},
    getCurrentPeriodProgress: function (periodLength) { return 85; },
    prepareToReport: function (branch, periodLength, address, cb) {},
    getRepRedistributionDone: function (p) {},
    getReportHash: function (p, cb) {}
  });
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: undefined,
      encryptedSalt: undefined,
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: noop,
      onFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    submitReportHash: function (p) {
      assert.deepEqual(p.encryptedReport, 0);
      assert.deepEqual(p.encryptedSalt, 0);
      assert.deepEqual(p.ethics, abi.fix('1', 'hex'));
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '0', from: '0xdeadbeef' });
    },
    getCurrentPeriodProgress: function (periodLength) { return 23; },
    prepareToReport: function (branch, periodLength, address, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(address, '0xdeadbeef');
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    getRepRedistributionDone: function (p) {},
    getReportHash: function (p, cb) {}
  });
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e',
      encryptedSalt: '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c',
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: noop,
      onFailed: function (err) {
        assert.deepEqual(err, "Rep redistribution not done");
        finished();
      }
    },
    submitReportHash: function (p) {
      assert.deepEqual(p.encryptedReport, '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e');
      assert.deepEqual(p.encryptedSalt, '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c');
      assert.deepEqual(p.ethics, abi.fix('1', 'hex'));
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '0', from: '0xdeadbeef' });
    },
    getCurrentPeriodProgress: function (periodLength) { return 23; },
    prepareToReport: function (branch, periodLength, address, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(address, '0xdeadbeef');
      cb();
    },
    getRepRedistributionDone: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.reporter, '0xdeadbeef');
      p.callback("0");
    },
    getReportHash: function (p, cb) {}
  });
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e',
      encryptedSalt: '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c',
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1', from: '0xdeadbeef' });
        assert.deepEqual(submitReportHashCC, 2);
        finished();
      },
      onFailed: noop
    },
    submitReportHash: function (p) {
      submitReportHashCC++;
      assert.deepEqual(p.encryptedReport, '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e');
      assert.deepEqual(p.encryptedSalt, '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c');
      assert.deepEqual(p.ethics, abi.fix('1', 'hex'));
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: (submitReportHashCC - 1), from: '0xdeadbeef' });
    },
    getCurrentPeriodProgress: function (periodLength) { return 23; },
    prepareToReport: function (branch, periodLength, address, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(address, '0xdeadbeef');
      cb();
    },
    getRepRedistributionDone: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.reporter, '0xdeadbeef');
      p.callback("1");
    },
    getReportHash: function (p, cb) {}
  });
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e',
      encryptedSalt: '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c',
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1', from: '0xdeadbeef' });
        assert.deepEqual(submitReportHashCC, 1);
        finished();
      },
      onFailed: noop
    },
    submitReportHash: function (p) {
      submitReportHashCC++;
      assert.deepEqual(p.encryptedReport, '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e');
      assert.deepEqual(p.encryptedSalt, '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c');
      assert.deepEqual(p.ethics, abi.fix('1', 'hex'));
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '-2', from: '0xdeadbeef' });
    },
    getCurrentPeriodProgress: function (periodLength) { return 23; },
    prepareToReport: function (branch, periodLength, address, cb) {},
    getRepRedistributionDone: function (p) {},
    getReportHash: function (p, cb) {
      assert.deepEqual(p, {
        branch: '0xb1',
        expDateIndex: 1500,
        reporter: '0xdeadbeef',
        event: '0xe1'
      });
      cb('0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f')
    }
  });
  test({
    params: {
      event: '0xe1',
      reportHash: '0x7757ad460dc257b396f42cb184d5d166c259ae817bdeef01d88a8b00e152f10f',
      encryptedReport: '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e',
      encryptedSalt: '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c',
      ethics: '1',
      branch: '0xb1',
      period: 1500,
      periodLength: 1000,
      onSent: noop,
      onSuccess: noop,
      onFailed: function (err) {
        assert.deepEqual(err, { "-2": "not in first half of period (commit phase)" });
        finished();
      }
    },
    submitReportHash: function (p) {
      submitReportHashCC++;
      assert.deepEqual(p.encryptedReport, '0x90c6b55cf923c83de5155e4ddc0480040976efcf39a900a64498f186fcf24b1e');
      assert.deepEqual(p.encryptedSalt, '0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c');
      assert.deepEqual(p.ethics, abi.fix('1', 'hex'));
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '-2', from: '0xdeadbeef' });
    },
    getCurrentPeriodProgress: function (periodLength) { return 23; },
    prepareToReport: function (branch, periodLength, address, cb) {},
    getRepRedistributionDone: function (p) {},
    getReportHash: function (p, cb) {
      assert.deepEqual(p, {
        branch: '0xb1',
        expDateIndex: 1500,
        reporter: '0xdeadbeef',
        event: '0xe1'
      });
      cb();
    }
  });
});

describe("submitReport", function () {
  var finished;
  var submitReport = augur.api.MakeReports.submitReport;
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;

      augur.api.MakeReports.submitReport = t.submitReport;

      t.assertions(augur.reporting.submitReport(t.params));

      augur.api.MakeReports.submitReport = submitReport;
    });
  };
  test({
    params: {
      event: '0xe1',
      salt: 'salt',
      report: '1',
      ethics: 1,
      minValue: 1,
      maxValue: 2,
      type: 'binary',
      isIndeterminate: false,
    },
    assertions: function (out) {
      assert.deepEqual(JSON.stringify(out), JSON.stringify({
        event: '0xe1',
        salt: abi.hex('salt'),
        report: '0xde0b6b3a7640000',
        ethics: 1,
        minValue: 1,
        maxValue: 2,
        type: 'binary',
        isIndeterminate: false,
      }));
      finished();
    },
    submitReport: function (p) {
      // simply return inputs for the assetion function
      return p;
    }
  });
});
