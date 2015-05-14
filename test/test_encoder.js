/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");
var coder = require("./solidity/coder");

Augur.connect();

var log = console.log;

describe("Solidity encoder (from web3.js)", function () {
    describe('encodeParams', function () {
        var test = function (t) {
            it('should turn ' + t.values + ' to ' + t.expected, function () {
                assert.equal(coder.encodeParams(t.types, t.values), t.expected);
            });
        };
    });
});

describe("Contract ABI data serialization", function () {
    describe("No parameters", function () {
        it("ten()", function () {
            var tx = { method: "ten" };
            assert.equal(Augur.encode_abi(tx), "0x643ceff9");
        });
        it("faucet()", function () {
            var tx = { method: "faucet" };
            assert.equal(Augur.encode_abi(tx), "0xde5f72fd");
        });
        it("getBranches()", function () {
            var tx = { method: "getBranches" };
            assert.equal(Augur.encode_abi(tx), "0xc3387858");
        });
    });
    describe("One int256 parameter", function () {
        var test = function (expected, method, signature, params) {
            it(method + "(" + params + ")", function () {
                var tx, len, types, encoded, solcoded;
                tx = { method: method };
                types = [];
                if (signature) {
                    tx.signature = signature;
                    len = tx.signature.length;
                    for (var i = 0; i < len; ++i) {
                        if (tx.signature[i] === 's') {
                            types.push("bytes");
                        } else if (tx.signature[i] === 'a') {
                            types.push("int256[]");
                        } else {
                            types.push("int256");
                        }
                    }
                }
                if (params) tx.params = params;
                encoded = Augur.encode_abi(tx);
                solcoded = coder.encodeParams(types, [params]);
                assert.equal(encoded, expected);
                assert.equal(encoded, Augur.get_prefix(method, signature) + solcoded);
            });
        };

        test("0x6ffa1caa"+
                "0000000000000000000000000000000000000000000000000000000000000003",
            "double", "i",
            [3]);
        test("0xb3903c8a"+
                "00000000000000000000000000000000000000000000000000000000000f69b5",
            "getMarkets", "i",
            1010101);
        test("0x7a66d7ca"+
                "00000000000000000000000000000000000000000000000000000000000f69b5",
            "getVotePeriod", "i",
            1010101);
        test("0x37e7ee00"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
            "getDescription", "i",
            "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");
        test("0x1aecdb5b"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
            "getEventInfo", "i",
            "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");
    });
    describe("Multiple int256 parameters", function () {
        it("multiply(2,3)", function () {
            var tx = {
                to: constants.examples.multiplier,
                method: "multiply",
                signature: "ii",
                params: [2, 3]
            };
            var expected = "0x3c4308a8"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003";
            assert.equal(Augur.encode_abi(tx), expected);
        });
        it("sendReputation", function () {
            var tx = Augur.tx.sendReputation;
            tx.params = [
                Augur.branches.alpha,
                constants.accounts.scottzer0,
                Augur.fix("5").toFixed()
            ];
            var expected = "0xa677135c"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"+
                "0000000000000000000000006fc0a64e2dce367e35417bfd1568fa35af9f3e4b"+
                "0000000000000000000000000000000000000000000000050000000000000000";
            var actual = Augur.encode_abi(tx);
            var types = ["int256", "int256", "int256"];
            assert.equal(actual, expected);
            assert.equal(actual, "0xa677135c" + coder.encodeParams(types, tx.params));
        });
    });
    describe("Single int256[] parameter", function () {
        it("double([4,7])", function () {
            var tx = {
                from: '0x63524e3fe4791aefce1e932bbfb3fdf375bfad89',
                to: '0x86c62f40cd49b3a42fad6104f38b3f68aa9871f8',
                method: 'double',
                signature: 'a',
                params: [[4, 7]]
            };
            var expected = "0x8de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000007";
            assert.equal(Augur.encode_abi(tx), expected);
        });
    });
    describe("Multiple parameters: int256, int256[]", function () {
        it("slashRep", function () {
            var branch_id = "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991";
            var vote_period = "1170";
            var salt = "1337";
            var report = [1, 2, 1, 1];
            var reporter = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
            var expected = "0x660a246c"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "0000000000000000000000000000000000000000000000000000000000000492"+
                "0000000000000000000000000000000000000000000000000000000000000539"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000001";
            var tx = Augur.tx.slashRep;
            tx.params = [branch_id, vote_period, salt, report, reporter];
            assert.equal(Augur.encode_abi(tx), expected);
        });
    });
    describe("Multiple parameters: int256, string", function () {
        it("createEvent('my event')", function () {
            var tx = {
              method: 'createEvent',
              signature: 'isiiii',
              params: 
               [ '0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991',
                 'my event',
                 250000,
                 1,
                 2,
                 2 ]
            };
            var expected = "0x130dd1b3"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "000000000000000000000000000000000000000000000000000000000003d090"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000008"+
                "6d79206576656e74000000000000000000000000000000000000000000000000";
            assert.equal(Augur.encode_abi(tx), expected);
        });
        it("createEvent('augur ragefest 2015')", function () {
            var tx = {
                method: "createEvent",
                signature: "isiiii",
                params: [
                    "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                    "augur ragefest 2015",
                    250000,
                    1,
                    2,
                    2
                ]
            };
            var expected = "0x130dd1b3"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "000000000000000000000000000000000000000000000000000000000003d090"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000013"+
                "6175677572207261676566657374203230313500000000000000000000000000";
            assert.equal(Augur.encode_abi(tx), expected);
        });
        it("createEvent('')", function () {
            var tx = {
                method: "createEvent",
                signature: "isiiii",
                params: [
                    "0x3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5",
                    "Will Jack win the June 2015 Augur Breakdancing Competition?",
                    800029,
                    0,
                    1,
                    2
                ]
            };
            var expected = "0x130dd1b3"+
                "3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "00000000000000000000000000000000000000000000000000000000000c351d"+
                "0000000000000000000000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "000000000000000000000000000000000000000000000000000000000000003b"+
                "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                "7220427265616b64616e63696e6720436f6d7065746974696f6e3f";
        });
    });
    describe("Multiple parameters: int256, string, int256[]", function () {
        it("createMarket('market for ragefests')", function () {
            var tx = {
                method: "createMarket",
                signature: "isiiia",
                params: [
                    "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                    "market for ragefests",
                    "0x1000000000000000",
                    "0x2800000000000000000",
                    "0x400000000000000",
                    ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
                     "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
                     "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"]
                ]
            };
            var expected = "0x8d19b3f"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "0000000000000000000000000000000000000000000000001000000000000000"+
                "0000000000000000000000000000000000000000000002800000000000000000"+
                "0000000000000000000000000000000000000000000000000400000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000100"+
                "0000000000000000000000000000000000000000000000000000000000000014"+
                "6d61726b657420666f7220726167656665737473000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"+
                "4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12"+
                "412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83";
            assert.equal(Augur.encode_abi(tx), expected);
        });
        // negative hash
        it("createMarket('unicorns are real')", function () {
            var tx = {
                method: "createMarket",
                signature: "isiiia",
                params: [
                    "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                    "unicorns are real",
                    "0x10000000000000000",
                    "0xa0000000000000000",
                    "0xa0000000000000000",
                    ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"]
                ]
            };
            var expected = "0x8d19b3f"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "0000000000000000000000000000000000000000000000010000000000000000"+
                "00000000000000000000000000000000000000000000000a0000000000000000"+
                "00000000000000000000000000000000000000000000000a0000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000100"+
                "0000000000000000000000000000000000000000000000000000000000000011"+
                "756e69636f726e7320617265207265616c000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "d51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591";
            assert.equal(Augur.encode_abi(tx), expected);
        });
    });
});
