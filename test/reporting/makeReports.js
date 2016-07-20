/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augur = require("../tools").setup(require("../../src"), process.argv.slice(2));

describe("hashSenderPlusEvent", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            assert.strictEqual(abi.hex(augur.hashSenderPlusEvent(t.sender, t.event)), t.expected);
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

describe("makeHash", function () {
    var test = function (t) {
        it("salt=" + t.salt + ", report=" + t.report + ", eventID=" + t.eventID, function () {
            var localHash = augur.makeHash(t.salt, t.report, t.eventID, t.sender, t.isScalar);
            var contractHash = augur.MakeReports.makeHash(abi.hex(t.salt), abi.fix(t.report, "hex"), t.eventID, t.sender);
            assert.strictEqual(localHash, contractHash);
        });
    };
    test({
        salt: "1337",
        report: 1,
        sender: augur.from,
        eventID: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e"
    });
    for (var i = 0; i < 10; ++i) {
        test({
            salt: abi.prefix_hex(utils.sha256(Math.random().toString())),
            report: Math.round(Math.random() * 50),
            sender: augur.from,
            eventID: abi.prefix_hex(utils.sha256(Math.random().toString()))
        });
        test({
            salt: abi.prefix_hex(utils.sha256(Math.random().toString())),
            report: Math.round(Math.random() * 50),
            sender: augur.from,
            eventID: abi.prefix_hex(utils.sha256(Math.random().toString())),
            isScalar: true
        });
    }
});
