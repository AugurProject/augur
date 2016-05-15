/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var chalk = require("chalk");
var augurpath = "../../src/index";
var augur = require(augurpath);
var runner = require("../runner");
var tools = require("../tools");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, [{
            method: "makeTradeHash",
            parameters: ["fixed", "fixed", "hashArray"]
        }, {
            method: "getInitialTrade",
            parameters: ["hash"]
        }, {
            method: "checkHash",
            parameters: ["hash", "address"]
        }, {
            method: "getID",
            parameters: ["hash"]
        }, {
            method: "get_trade",
            parameters: ["hash"]
        }, {
            method: "get_amount",
            parameters: ["hash"]
        }, {
            method: "get_price",
            parameters: ["hash"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "setInitialTrade",
            parameters: ["hash"]
        }, {
            method: "commitTrade",
            parameters: ["hash"]
        }, {
            method: "zeroHash",
            parameters: []
        }, {
            method: "saveTrade",
            parameters: ["hash", "int", "hash", "fixed", "fixed", "address", "int"]
        }, {
            method: "update_trade",
            parameters: ["hash", "fixed"]
        }, {
            method: "remove_trade",
            parameters: ["hash"]
        }, {
            method: "fill_trade",
            parameters: ["hash", "fixed"]
        }, {
            method: "cancel",
            parameters: ["hash"]
        }, {
            method: "buy",
            parameters: ["fixed", "fixed", "hash", "int"]
        }, {
            method: "sell",
            parameters: ["fixed", "fixed", "hash", "int"]
        }, {
            method: "short_sell",
            parameters: ["hash", "fixed"]
        }]);
    });
});

describe("Integration tests", function () {

    if (!process.env.CONTINUOUS_INTEGRATION) {

        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var branchID = augur.branches.dev;
        var markets = augur.getMarketsInBranch(branchID);
        
        describe("buy", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.buy({
                        amount: t.amount,
                        price: t.price,
                        market: t.market,
                        outcome: t.outcome,
                        onSent: function (r) {
                            console.log("buy sent:", r);
                        },
                        onSuccess: function (r) {
                            console.log("buy success:", r);
                            augur.get_trade_ids(t.market, function (tradeIds) {
                                console.log("trade IDs:", tradeIds);
                                assert.isArray(tradeIds);
                                assert.isAbove(tradeIds.length, 0);
                                done();
                            });
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 1,
                price: "0.5",
                outcome: "1"
            });
            test({
                market: markets[markets.length - 1],
                amount: "0.25",
                price: "0.52",
                outcome: "1"
            });
        });

        describe("sell", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {},
                        onSuccess: function (r) {
                            augur.sell({
                                amount: t.amount,
                                price: t.price,
                                market: t.market,
                                outcome: t.outcome,
                                onSent: function (r) {
                                    console.log("sell sent:", r);
                                },
                                onSuccess: function (r) {
                                    console.log("sell success:", r);
                                    augur.get_trade_ids(t.market, function (tradeIds) {
                                        console.log("trade IDs:", tradeIds);
                                        assert.isArray(tradeIds);
                                        assert.isAbove(tradeIds.length, 0);
                                        done();
                                    });
                                },
                                onFailed: done
                            });
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 1,
                price: "0.5",
                outcome: "1"
            });
            test({
                market: markets[markets.length - 1],
                amount: "0.25",
                price: "0.52",
                outcome: "1"
            });
        });

        describe("trade", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {},
                        onSuccess: function (r) {
                            augur.get_trade_ids(t.market, function (trade_ids) {
                                async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                                    augur.get_trade(thisTrade, function (tradeInfo) {
                                        // { id: '0x63d33bdc658dfc0e33e73dc77048a6ff5ec3609c3f55f70404506dc128ce33e',
                                        //   type: 'buy',
                                        //   market: '-0x60573eff58c22ec05955bb1df4dce40e0374ce6f10d52326bed17564c360f7e0',
                                        //   amount: '0.25',
                                        //   price: '0.51999999999999999998',
                                        //   owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
                                        //   block: 945487,
                                        //   refhash: '0x1',
                                        //   outcome: undefined }
                                        if (!tradeInfo) return nextTrade("no trade info found");
                                        if (tradeInfo.owner === augur.from) return nextTrade();
                                        console.log("using trade:", tradeInfo);
                                        augur.trade({
                                            max_value: t.max_value,
                                            max_amount: 0,
                                            trade_ids: [trade_ids[0]],
                                            onTradeHash: function (r) {
                                                assert.notProperty(r, "error");
                                                assert.isString(r);
                                            },
                                            onCommitSent: function (r) {
                                                assert.strictEqual(r.callReturn, "1");
                                            },
                                            onCommitSuccess: function (r) {
                                                assert.strictEqual(r.callReturn, "1");
                                            },
                                            onCommitFailed: nextTrade,
                                            onTradeSent: function (r) {
                                                console.log("trade sent:", r);
                                            },
                                            onTradeSuccess: function (r) {
                                                console.log("trade success:", r);
                                                nextTrade(r);
                                            },
                                            onTradeFailed: nextTrade
                                        });
                                    });
                                }, function (x) {
                                    if (x && x.callReturn) return done();
                                    done(x);
                                });
                            });
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 0.1,
                price: "0.5",
                outcome: "1",
                max_value: 1
            });
        });

        describe("cancel", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {},
                        onSuccess: function (r) {
                            augur.sell({
                                amount: t.amount,
                                price: t.price,
                                market: t.market,
                                outcome: t.outcome,
                                onSent: function (r) {
                                    console.log("sell sent:", r);
                                },
                                onSuccess: function (r) {
                                    console.log("sell success:", r);
                                    augur.get_trade_ids(t.market, function (trade_ids) {
                                        augur.cancel(trade_ids[0], function (r) {
                                            console.log("cancel sent:", r);
                                        }, function (r) {
                                            console.log("cancel success:", r);
                                            done();
                                        }, done);
                                    });
                                },
                                onFailed: done
                            });
                        },
                        onFailed: done
                    });
                });
            };
            test({
                market: markets[markets.length - 1],
                amount: 1,
                price: "0.5",
                outcome: "1"
            });
        });
    }
});
