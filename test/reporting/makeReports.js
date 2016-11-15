/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var reporting = require("../../src/modules/reporting");
var makeReports = require("../../src/modules/makeReports");
var augur;

describe("hashSenderPlusEvent", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            assert.strictEqual(abi.hex(reporting.hashSenderPlusEvent(t.sender, t.event)), t.expected);
        });
    };
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x35d9b91c2831cd006c2bce8e6041d5cf3556854a11edb"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        // max event ID: 2^255-1
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x15ee6af1180c99de9bc7df673404eff65d5fb88c18024"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x3f3e8cbbdebd40c2ef199bb5974e7190d580064a0f3ba"
    });
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x515cf8bc0ec96f3d0739e87d99117651a5bbccc18f2fb"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        // min event ID: 2^255
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x6ad5dc4ea393410284d203f975d4899358e9c07371"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x473effe6033fdc3ade8c4efad2b9b162e74bdc7783390"
    });
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x2c118f32317f17d58e4221d9b5d36db1e2d88f7bb2166"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x160a0ce2ed63d80a420d26ecdcb7f355346d206166778"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x3ab2205acd2f4f80962e55de910b7249ab79273b0cdc5"
    });
});

describe("fixReport / unfixReport", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var fixedReport = makeReports.fixReport(
                t.report,
                t.minValue || "1",
                t.maxValue || "2",
                t.type,
                t.isIndeterminate
            );
            assert.strictEqual(fixedReport, t.expected);
            var unfixed = makeReports.unfixReport(fixedReport, t.minValue, t.maxValue, t.type);
            assert.strictEqual(unfixed.report, t.report);
            assert.strictEqual(unfixed.isIndeterminate, !!t.isIndeterminate);
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
        expected: constants.BINARY_INDETERMINATE
    });
    test({
        report: "0.5",
        minValue: "0",
        maxValue: "1",
        type: "scalar",
        isIndeterminate: true,
        expected: constants.CATEGORICAL_SCALAR_INDETERMINATE
    });
    test({
        report: "0.5",
        minValue: "0",
        maxValue: "1",
        type: "scalar",
        isIndeterminate: false,
        expected: constants.INDETERMINATE_PLUS_ONE
    });
    test({
        report: "0.5",
        minValue: "0",
        maxValue: "1",
        type: "scalar",
        isIndeterminate: false,
        expected: constants.INDETERMINATE_PLUS_ONE
    });
    test({
        report: "1.5",
        minValue: "0",
        maxValue: "1",
        type: "binary",
        isIndeterminate: true,
        expected: constants.BINARY_INDETERMINATE
    });
    test({
        report: "0.5",
        minValue: "0",
        maxValue: "1",
        type: "scalar",
        isIndeterminate: true,
        expected: constants.CATEGORICAL_SCALAR_INDETERMINATE
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
        expected: constants.CATEGORICAL_SCALAR_INDETERMINATE
    });
});

describe("Report encryption/decryption", function () {
    var test = function (t) {
        it("encryptReport(" + t.report + "," + t.key + "," + t.salt + ") -> " + t.encryptedReport, function () {
            var encryptedReport = makeReports.encryptReport(t.report, t.key, t.salt);
            assert.strictEqual(encryptedReport, t.encryptedReport);
        });
        it("decryptReport(" + t.encryptedReport + "," + t.key + "," + t.salt + ") -> " + t.report, function () {
            var decryptedReport = makeReports.decryptReport(t.encryptedReport, t.key, t.salt);
            assert.strictEqual(decryptedReport, abi.format_int256(t.report));
        });
    };
    test({
        report: makeReports.fixReport(1, 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
    });
    test({
        report: makeReports.fixReport("0x1", 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
    });
    test({
        report: makeReports.fixReport("1", 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902ab0b42cb64d38014"
    });
    test({
        report: makeReports.fixReport(0, 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
    });
    test({
        report: makeReports.fixReport("0x0", 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
    });
    test({
        report: makeReports.fixReport("0", 1, 2, "binary"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a6ebf478c3b78014"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar"),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058015"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar", true),
        key: "0x1",
        salt: "0x1",
        encryptedReport: "0x6b6cfe160a6263631b292f879eeff926c9d2b5db15fd8902a01baf2110058014"
    });
    test({
        report: makeReports.fixReport(1, 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
    });
    test({
        report: makeReports.fixReport("0x1", 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
    });
    test({
        report: makeReports.fixReport("1", 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbeff305f7212bed1d"
    });
    test({
        report: makeReports.fixReport(0, 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
    });
    test({
        report: makeReports.fixReport("0x0", 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
    });
    test({
        report: makeReports.fixReport("0", 1, 2, "binary"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe213b344864fed1d"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar"),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe4e3e81d55fded1c"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar", true),
        key: "0x1",
        encryptedReport: "0x774988b91e31a2a9b745e7e923306eadc37244bc4de3eebbe4e3e81d55fded1d"
    });
    test({
        report: makeReports.fixReport(1, 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
    });
    test({
        report: makeReports.fixReport("0x1", 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
    });
    test({
        report: makeReports.fixReport("1", 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec57ca16afb271443"
    });
    test({
        report: makeReports.fixReport(0, 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
    });
    test({
        report: makeReports.fixReport("0x0", 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
    });
    test({
        report: makeReports.fixReport("0", 1, 2, "binary"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ec89c17d95c431443"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar"),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ece6c4c808ff11442"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar", true),
        key: "0x68e4593db968928abbdfe5746809c02b7527bdf110cbbe16ae1defa081cc6a3c",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0xd8030298d9e1083080840df4fbcb98daacbfdc0b9af5f27ece6c4c808ff11443"
    });
    test({
        report: makeReports.fixReport(1, 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
    });
    test({
        report: makeReports.fixReport("0x1", 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
    });
    test({
        report: makeReports.fixReport("1", 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a3180766015df9660125261b"
    });
    test({
        report: makeReports.fixReport(0, 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
    });
    test({
        report: makeReports.fixReport("0x0", 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
    });
    test({
        report: makeReports.fixReport("0", 1, 2, "binary"),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660cbd4fd5a641261b"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar", false),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660a4d148c75f3261a"
    });
    test({
        report: makeReports.fixReport("0.5", 0, 1, "scalar", true),
        key: "0x3c1ea91bd9b602defe621fa65d9049c6244324c6ccbb875f07b30c7664749d97",
        salt: "0xa4a71c2a3adb18bdfa964288e9b473199a7b69a79b040affa9df8690dee32ced",
        encryptedReport: "0x274d7a5ce711c5c2580e387018469ec3d5b987c0a31807660a4d148c75f3261b"
    });
});

describe("makeHash", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var localHash = makeReports.makeHash(t.salt, t.report, t.event, t.from, t.isScalar, t.isIndeterminate);
            if (t.expected) {
                assert.strictEqual(localHash, t.expected);
            } else {
                assert.strictEqual(localHash, augur.MakeReports.makeHash(abi.hex(t.salt), abi.hex(t.report), t.event, t.from));
            }
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
        report: constants.BINARY_INDETERMINATE,
        from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
        event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
        expected: "0xb4d39f3969a897a0d3872361ecadf9d87e7d43ee3eb63ccff7f94ed548b95d2c"
    });
    test({
        salt: "1337",
        report: constants.CATEGORICAL_SCALAR_INDETERMINATE,
        from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
        event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
        expected: "0x43c678db38cdc86f109f0c8cccebf300b9fec908dd59ac905191b9c755e26c0a"
    });
    test({
        salt: "1337",
        report: constants.INDETERMINATE_PLUS_ONE,
        from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
        event: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e",
        expected: "0xd8566eb441e5a90f035b72cb3fbd44d783f627b9d1503f5a2bfce7fab5853685"
    });
    if (process.env.AUGURJS_INTEGRATION_TESTS) {
        augur = require("../tools").setup(require("../../src"), process.argv.slice(2));
        var salt, report, from, event, isScalar, isIndeterminate;
        for (var i = 0; i < 10; ++i) {
            salt = abi.prefix_hex(utils.sha256(Math.random().toString()));
            report = Math.round(Math.random() * 50);
            event = abi.prefix_hex(utils.sha256(Math.random().toString()));
            test({
                salt: salt,
                report: report,
                from: augur.from,
                event: event,
                isScalar: false,
                isIndeterminate: false
            });
            test({
                salt: salt,
                report: report,
                from: augur.from,
                event: event,
                isScalar: true,
                isIndeterminate: false
            });
            test({
                salt: salt,
                report: report,
                from: augur.from,
                event: event,
                isScalar: false,
                isIndeterminate: true
            });
            test({
                salt: salt,
                report: report,
                from: augur.from,
                event: event,
                isScalar: false,
                isIndeterminate: false
            });
        }
    }
});
