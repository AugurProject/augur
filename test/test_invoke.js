/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

var args = process.argv.slice(2);
if (args.length && args[0] === "--gospel") {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
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
