/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var contracts = require("augur-contracts");
var tools = require("../tools");
var runner = require("../runner");

describe("Unit tests", function () {
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "buyCompleteSets",
            parameters: ["hash", "fixed"]
        }, {
            method: "sellCompleteSets",
            parameters: ["hash", "fixed"]
        }]);
    });
});

describe("Integration tests", function () {

    if (process.env.AUGURJS_INTEGRATION_TESTS) {

        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var branchID = augur.branches.dev;
        var markets = augur.getMarketsInBranch(branchID);
        
        describe("buyCompleteSets", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                        },
                        onSuccess: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                            done();
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 1
            });
            test({
                market: markets[markets.length - 1],
                amount: "1.2"
            });
            test({
                market: markets[markets.length - 1],
                amount: "0.1"
            });
            test({
                market: markets[markets.length - 2],
                amount: "0.01"
            });
        });

        describe("sellCompleteSets", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.sellCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                        },
                        onSuccess: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                            done();
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 1
            });
            test({
                market: markets[markets.length - 1],
                amount: "1.2"
            });
            test({
                market: markets[markets.length - 1],
                amount: "0.1"
            });
            test({
                market: markets[markets.length - 2],
                amount: "0.01"
            });
        });
    }
});
