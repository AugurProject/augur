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
var utilities = require("./utilities");

Augur = utilities.setup(Augur, process.argv.slice(2));

describe("Invoke contract functions", function () {
    // No parameters
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
    describe("No parameters", function () {
        describe("cash.se: " + Augur.contracts.cash, function () {
            var method = "faucet";
            var params = "";
            var expected = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
            it(method + "(" + params + ") -> " + expected, function () {
                var tx = {
                    to: Augur.contracts.cash,
                    from: Augur.coinbase,
                    method: method,
                    params: params,
                    send: false
                };
                var expected = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                utilities.test_invoke(Augur, tx, expected);
            });
            expected = "-1";
            it(method + "(" + params + ") -> " + expected, function () {
                var expected = "-1";
                var tx = {
                    to: Augur.contracts.cash,
                    from: Augur.coinbase,
                    method: method,
                    params: params,
                    send: false,
                    returns: "number"
                };
                utilities.test_invoke(Augur, tx, expected);
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
                utilities.test_invoke(Augur, tx, [
                    "0xe8",
                    "0xe8"
                ], function (a) {
                    a.slice(1,2);
                });
            });
        });
    });
});
