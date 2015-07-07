/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var constants = require("./constants");
var utilities = require("./utilities");
var Augur = utilities.setup(require("../augur"), process.argv.slice(2));
var log = console.log;

describe("Invoke contract functions", function () {
    // No parameters
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
    describe("No parameters", function () {
        describe("faucet.se: " + Augur.contracts.faucets, function () {
            var method = "cashFaucet";
            var params = "";
            it(method + "(" + params + ")", function () {
                var tx = {
                    to: Augur.contracts.faucets,
                    from: Augur.coinbase,
                    method: method,
                    params: params,
                    send: false
                };
                var result = Augur.invoke(tx);
                assert(result === "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    || result === "0x01");
            });
            it(method + "(" + params + ")", function () {
                var tx = {
                    to: Augur.contracts.faucets,
                    from: Augur.coinbase,
                    method: method,
                    params: params,
                    send: false,
                    returns: "number"
                };
                var result = Augur.invoke(tx);
                assert(result === "1" || result === "-1");
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
