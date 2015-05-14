/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

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
function copy(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
function test(itx, expected, apply) {
    var tx = copy(itx);
    if (tx.send === undefined) {
        tx.send = false;
        runtest(tx, expected, apply);
    } else {
        runtest(tx, expected, apply);
    }
}

describe("Invoke contract functions", function () {
    // No parameters
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
    describe("No parameters", function () {
        // describe("ten.se: " + constants.examples.ten, function () {
        //     var method = "ten";
        //     var params = "";
        //     var expected = "10";
        //     var tx = {
        //         to: constants.examples.ten,
        //         from: Augur.coinbase,
        //         method: method,
        //         send: false,
        //         params: params,
        //         returns: "number"
        //     };
        //     it(method + "(" + params + ") -> " + expected, function () {
        //         assert.equal(Augur.invoke(tx), expected);
        //     });
        //     expected = new BigNumber(10);
        //     it(method + "(" + params + ") -> " + expected, function () {
        //         tx.returns = "bignumber";
        //         test(tx, expected, String);
        //     });
        // });
        describe("cash.se: " + Augur.contracts.cash, function () {
            var method = "faucet";
            var params = "";
            var expected = "0x01";
            it(method + "(" + params + ") -> " + expected, function () {
                var tx = {
                    to: Augur.contracts.cash,
                    from: Augur.coinbase,
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
                    from: Augur.coinbase,
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
    // describe("Single integer parameter", function () {
    //     describe("mul2.se: " + constants.examples.mul2, function () {
    //         var tx = {
    //             to: constants.examples.mul2,
    //             from: Augur.coinbase,
    //             method: "double",
    //             signature: "i",
    //             returns: "number"
    //         };
    //         it("double(3) -> 6", function () {
    //             tx.params = [3];
    //             test(tx, "6");
    //         });
    //         it("double(100) -> 200", function () {
    //             tx.params = 100;
    //             test(tx, "200");
    //         });
    //         it("double(22121) -> 44242", function () {
    //             tx.params = 22121;
    //             test(tx, "44242");
    //         });
    //     });
    // });
    // multiple integer parameters
    // describe("Multiple integer parameters", function () {
    //     describe("multiplier.se: " + constants.examples.multiplier, function () {
    //         var tx = {
    //             to: constants.examples.multiplier,
    //             from: Augur.coinbase,
    //             method: "multiply",
    //             signature: "ii",
    //             returns: "number"
    //         };
    //         it("multiply(2,3) -> 6", function () {
    //             tx.params = [2, 3];
    //             test(tx, "6");
    //         });
    //         it("multiply(123,321) -> 39483", function () {
    //             tx.params = [123, 321];
    //             test(tx, "39483");
    //         });
    //     });
    // });
    // Single integer parameter, array return value
    describe("Single integer parameter, array return value", function () {
        describe("branches.se: " + Augur.contracts.branches, function () {
            var tx = {
                to: Augur.contracts.branches,
                from: Augur.coinbase,
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
// describe("Batch RPC", function () {
//     describe("batch(ten.ten, mul2.double(3))", function () {
//         var test = function (res) {
//             assert.equal(res.constructor, Array);
//             assert.equal(res.length, 2);
//             assert.equal(parseInt(res[0]), 10);
//             assert.equal(parseInt(res[1]), 6);
//         };
//         var txlist = [{
//             to: constants.examples.ten,
//             from: Augur.coinbase,
//             method: "ten",
//             returns: "number"
//         }, {
//             to: constants.examples.mul2,
//             from: Augur.coinbase,
//             method: "double",
//             signature: "i",
//             returns: "number",
//             params: 3
//         }];
//         it("sync: match separate invocations", function () {
//             test(Augur.batch(txlist));
//         });
//         it("async: match separate invocations", function (done) {
//             Augur.batch(txlist, function (res) {
//                 assert.equal(res.constructor, Array);
//                 assert.equal(res.length, 2);
//                 assert.equal(parseInt(res[0]), 10);
//                 assert.equal(parseInt(res[1]), 6);
//                 done();
//             });
//         });
//     });
// });
