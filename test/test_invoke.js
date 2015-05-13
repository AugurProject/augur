#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

function array_equal(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function check_results(res, expected, apply) {
    if (res) {
        if (apply) {
            if (res && res.constructor === Array) {
                assert(array_equal(apply(res), apply(expected)));
            } else {
                assert(apply(res) === apply(expected));
            }
        } else {
            if (res && res.constructor === Array) {
                assert(array_equal(res, expected));
            } else {
                assert(res === expected);
            }
        }
    } else {
        console.error("no or incorrect response", res);
    }
}
function runtest(tx, expected, apply) {
    if (tx && expected) {
        var res = Augur.invoke(tx);
        check_results(res, expected, apply);
    }
}
function test(itx, expected, apply) {
    var tx = Augur.clone(itx);
    if (tx.send === undefined) {
        tx.send = false;
        runtest(tx, expected, apply);
    } else {
        runtest(tx, expected, apply);
    }
}

describe("Contract ABI data serialization", function () {
    describe("No parameters", function () {
        describe("ten.se: " + constants.examples.ten, function () {
            it("ten() -> 0x643ceff9", function () {
                var tx = {
                    to: constants.examples.ten,
                    method: "ten",
                    send: false,
                    returns: "number"
                };
                assert.equal(Augur.abi_data(tx), "0x643ceff9");
            });
        });
        describe("cash.se: " + Augur.contracts.cash, function () {
            it("faucet() -> 0xde5f72fd", function () {
                var tx = {
                    to: Augur.contracts.cash,
                    method: "faucet",
                    send: false
                };
                assert.equal(Augur.abi_data(tx), "0xde5f72fd");
            });
        });
        describe("branches.se: " + Augur.contracts.branches, function () {
            var hex = "0xc3387858";
            it("getBranches() -> " + hex, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.branches,
                    method: "getBranches"
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
    });
    describe("One int256 parameter", function () {
        describe("mul2.se: " + constants.examples.mul2, function () {
            var hex = "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003";
            it("double() -> " + hex, function () {
                var tx = {
                    to: constants.examples.mul2,
                    method: "double",
                    signature: "i",
                    params: [3],
                    returns: "number"
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
        describe("branches.se: " + Augur.contracts.branches, function () {
            var hex = "0xb3903c8a00000000000000000000000000000000000000000000000000000000000f69b5";
            it("getMarkets(1010101) -> " + hex, function () {
                var tx = {
                    to: Augur.contracts.branches,
                    method: "getMarkets",
                    signature: "i",
                    params: 1010101,
                    returns: "array"
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
        describe("branches.se: " + Augur.contracts.branches, function () {
            var hex = "0x7a66d7ca00000000000000000000000000000000000000000000000000000000000f69b5";
            it("getVotePeriod(1010101) -> " + hex, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.branches,
                    method: "getVotePeriod",
                    signature: "i",
                    params: 1010101
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
        describe("info.se: " + Augur.contracts.info, function () {
            var method = "getDescription";
            var params = "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
            var hex = "0x37e7ee00b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
            it(method + "(" + params + ") -> " + hex, function () {
                var tx = {
                    to: Augur.contracts.info,
                    method: method,
                    signature: "i",
                    send: false,
                    params: params
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
        describe("events.se: " + Augur.contracts.events, function () {
            var method = "getEventInfo";
            var params = "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
            var hex = "0x1aecdb5bb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
            it(method + "(" + params + ") -> " + hex, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.events,
                    method: method,
                    signature: "i",
                    params: params
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
    });
    describe("Two int256 parameters", function () {
        describe("multiplier.se: " + constants.examples.multiplier, function () {
            var hex = "0x3c4308a800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003";
            it("multiply(2,3) -> " + hex, function () {
                var tx = {
                    to: constants.examples.multiplier,
                    method: "multiply",
                    signature: "ii",
                    params: [2, 3],
                    returns: "number"
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
    });
    describe("Multiple parameters: int256, string", function () {
        describe("createEvent.se: " + Augur.contracts.createEvent, function () {
            var hex = "0x74cd7d2000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000000000000000003d09000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000261756775722072616765666573742032303135";
            it("createEvent('augur ragefest 2015') -> " + hex, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.createEvent,
                    method: "createEvent",
                    signature: "isiiii",
                    params: [1010101, "augur ragefest 2015", 250000, 1, 2, 2],
                    gas: 2500000
                };
                assert.equal(Augur.abi_data(tx), hex);
            });
        });
    });
    describe("Multiple parameters: int256, string, int256[]", function () {
        describe("createMarket.se: " + Augur.contracts.createMarket, function () {
            var hex0 = "0x45d96cd70000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000f69b50000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000000004000000000000006d61726b657420666f7220726167656665737473b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83";
            it("createMarket('market for ragefests') -> " + hex0, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.createMarket,
                    method: "createMarket",
                    signature: "isiiia",
                    params: [
                        1010101,
                        "market for ragefests",
                        "0x1000000000000000",
                        "0x2800000000000000000",
                        "0x400000000000000",
                        ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
                         "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
                         "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"]
                    ],
                    gas: 3000000
                };
                assert.equal(Augur.abi_data(tx), hex0);
            });
            // negative hash
            var hex1 = "0x45d96cd70000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a0000000000000000756e69636f726e7320617265207265616cd51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591";
            it("createMarket('unicorns are real') -> " + hex1, function () {
                var tx = {
                    from: Augur.coinbase,
                    to: Augur.contracts.createMarket,
                    method: "createMarket",
                    signature: "isiiia",
                    params: [
                        1010101,
                        "unicorns are real",
                        "0x10000000000000000",
                        "0xa0000000000000000",
                        "0xa0000000000000000",
                        ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"]
                    ],
                };
                assert.equal(Augur.abi_data(tx), hex1);
            });
        });
    });
});
describe("Invoke contract functions", function () {
    // No parameters
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
    describe("No parameters", function () {
        describe("ten.se: " + constants.examples.ten, function () {
            var method = "ten";
            var params = "";
            var expected = "10";
            var tx = {
                to: constants.examples.ten,
                method: method,
                send: false,
                params: params,
                returns: "number"
            };
            it(method + "(" + params + ") -> " + expected, function () {
                assert.equal(Augur.invoke(tx), expected);
            });
            expected = new BigNumber(10);
            it(method + "(" + params + ") -> " + expected, function () {
                tx.returns = "bignumber";
                test(tx, expected, String);
            });
        });
        describe("cash.se: " + Augur.contracts.cash, function () {
            var method = "faucet";
            var params = "";
            var expected = "0x01";
            it(method + "(" + params + ") -> " + expected, function () {
                var tx = {
                    to: Augur.contracts.cash,
                    method: method,
                    params: params,
                    send: false
                };
                var expected = "0x01";
                test(tx, expected);
            });
            expected = "1";
            it(method + "(" + params + ") -> " + expected, function () {
                var expected = "1";
                var tx = {
                    to: Augur.contracts.cash,
                    method: method,
                    params: params,
                    send: false,
                    returns: "number"
                };
                test(tx, expected);
            });
        });
    });
    // Single integer parameter
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x5204f18c652d1c31c6a5968cb65e011915285a50","data":"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003","gas":"0x2dc6c0"}],"id":1}' http://127.0.0.1:8545
    describe("Single integer parameter", function () {
        describe("mul2.se: " + constants.examples.mul2, function () {
            var tx = {
                to: constants.examples.mul2,
                method: "double",
                signature: "i",
                returns: "number"
            };
            it("double(3) -> 6", function () {
                tx.params = [3];
                test(tx, "6");
            });
            it("double(100) -> 200", function () {
                tx.params = 100;
                test(tx, "200");
            });
            it("double(22121) -> 44242", function () {
                tx.params = 22121;
                test(tx, "44242");
            });
        });
    });
    // multiple integer parameters
    describe("Multiple integer parameters", function () {
        describe("multiplier.se: " + constants.examples.multiplier, function () {
            var tx = {
                to: constants.examples.multiplier,
                method: "multiply",
                signature: "ii",
                returns: "number"
            };
            it("multiply(2,3) -> 6", function () {
                tx.params = [2, 3];
                test(tx, "6");
            });
            it("multiply(123,321) -> 39483", function () {
                tx.params = [123, 321];
                test(tx, "39483");
            });
        });
    });
    // Single integer parameter, array return value
    describe("Single integer parameter, array return value", function () {
        describe("branches.se: " + Augur.contracts.branches, function () {
            var tx = {
                to: Augur.contracts.branches,
                method: "getMarkets",
                signature: "i",
                params: 1010101
            };
            it("getMarkets(1010101) -> " + JSON.stringify([
                    "0xe8",
                    "0xe8",
                    "..."
                ]), function () {
                tx.returns = "hash[]";
                test(tx, [
                    "0xe8",
                    "0xe8"
                ], function (a) {
                    a.slice(1,2);
                });
            });
        });
    });
});
describe("Batch RPC", function () {
    describe("batch(ten.ten, mul2.double(3))", function () {
        var test = function (res) {
            assert.equal(res.constructor, Array);
            assert.equal(res.length, 2);
            assert.equal(parseInt(res[0]), 10);
            assert.equal(parseInt(res[1]), 6);
        };
        var txlist = [{
            to: constants.examples.ten,
            method: "ten",
            returns: "number"
        }, {
            to: constants.examples.mul2,
            method: "double",
            signature: "i",
            returns: "number",
            params: 3
        }];
        it("sync: match separate invocations", function () {
            test(Augur.batch(txlist));
        });
        it("async: match separate invocations", function (done) {
            Augur.batch(txlist, function (res) {
                assert.equal(res.constructor, Array);
                assert.equal(res.length, 2);
                assert.equal(parseInt(res[0]), 10);
                assert.equal(parseInt(res[1]), 6);
                done();
            });
        });
    });
});
