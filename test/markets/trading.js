/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var chalk = require("chalk");
var augurpath = "../../src/index";
var augur = require(augurpath);
var runner = require("../runner");
var tools = require("../tools");
var rpc = augur.rpc;

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
        var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
        var accounts = rpc.personal("listAccounts");
        
        describe("buy", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.get_total_trades(t.market, function (initialTotalTrades) {
                        initialTotalTrades = parseInt(initialTotalTrades);
                        rpc.personal("unlockAccount", [augur.from, password]);
                        augur.buy({
                            amount: t.amount,
                            price: t.price,
                            market: t.market,
                            outcome: t.outcome,
                            onSent: function (r) {
                                assert(r.txHash);
                                assert(r.callReturn);
                            },
                            onSuccess: function (r) {
                                augur.get_total_trades(t.market, function (totalTrades) {
                                    assert.strictEqual(parseInt(totalTrades), initialTotalTrades + 1);
                                    rpc.personal("lockAccount", [augur.from]);
                                    done();
                                });
                            },
                            onFailed: done
                        });
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
                    rpc.personal("unlockAccount", [augur.from, password]);
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: t.amount,
                        onSent: function (r) {},
                        onSuccess: function (r) {
                            augur.get_total_trades(t.market, function (initialTotalTrades) {
                                initialTotalTrades = parseInt(initialTotalTrades);
                                augur.sell({
                                    amount: t.amount,
                                    price: t.price,
                                    market: t.market,
                                    outcome: t.outcome,
                                    onSent: function (r) {
                                        assert(r.txHash);
                                        assert(r.callReturn);
                                    },
                                    onSuccess: function (r) {
                                        augur.get_total_trades(t.market, function (totalTrades) {
                                            assert.strictEqual(parseInt(totalTrades), initialTotalTrades + 1);
                                            rpc.personal("lockAccount", [augur.from]);
                                            done();
                                        });
                                    },
                                    onFailed: done
                                });
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

        describe("cancel", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT);
                    rpc.personal("unlockAccount", [augur.from, password]);
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
                                    assert(r.txHash);
                                    assert(r.callReturn);
                                },
                                onSuccess: function (r) {
                                    assert(r.txHash);
                                    assert(r.callReturn);
                                    augur.get_trade_ids(t.market, function (trade_ids) {
                                        augur.cancel(trade_ids[0], function (r) {
                                            assert(r.txHash);
                                            assert.strictEqual(r.callReturn, "1");
                                        }, function (r) {
                                            assert(r.txHash);
                                            assert.strictEqual(r.callReturn, "1");
                                            rpc.personal("lockAccount", [augur.from]);
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

        describe("trade", function () {
            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(tools.TIMEOUT*4);
                    rpc.miner("start", 1);
                    rpc.personal("unlockAccount", [accounts[0], password]);
                    augur.from = accounts[0];
                    augur.connector.from_field_tx(accounts[0]);
                    augur.sync(augur.connector);
                    var initialTotalTrades = parseInt(augur.get_total_trades(t.market));
                    augur.buyCompleteSets({
                        market: t.market,
                        amount: 4,
                        onSent: function (r) {},
                        onSuccess: function (r) {
                            augur.sell({
                                amount: 1,
                                price: "0.01",
                                market: t.market,
                                outcome: t.outcome,
                                onSent: function (r) {
                                    rpc.personal("lockAccount", accounts[0]);
                                },
                                onSuccess: function (r) {
                                    rpc.miner("stop");
                                    augur.from = accounts[1];
                                    augur.connector.from_field_tx(accounts[1]);
                                    augur.sync(augur.connector);
                                    augur.get_trade_ids(t.market, function (trade_ids) {
                                        async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                                            augur.get_trade(thisTrade, function (tradeInfo) {
                                                if (!tradeInfo) return nextTrade("no trade info found");
                                                if (tradeInfo.owner === augur.from) return nextTrade();
                                                if (tradeInfo.type === "buy") return nextTrade();
                                                console.log("matched trade:", thisTrade, tradeInfo);
                                                rpc.miner("start", 1);
                                                rpc.personal("unlockAccount", [accounts[1], password]);
                                                augur.trade({
                                                    max_value: t.max_value,
                                                    max_amount: 0,
                                                    trade_ids: [thisTrade],
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
                                                        console.log("trade sent:", r)
                                                    },
                                                    onTradeSuccess: function (r) {
                                                        console.log("trade success:", r)
                                                        var totalTrades = parseInt(augur.get_total_trades(t.market));
                                                        assert((totalTrades === initialTotalTrades - 1)
                                                            || (totalTrades === initialTotalTrades));
                                                        var tradeIds = augur.get_trade_ids(t.market);
                                                        assert.strictEqual(tradeIds.indexOf(thisTrade), -1);
                                                        nextTrade(r);
                                                    },
                                                    onTradeFailed: nextTrade
                                                });
                                            });
                                        }, function (x) {
                                            // rpc.miner("stop");
                                            // rpc.personal("lockAccount", accounts[0]);
                                            // rpc.personal("lockAccount", accounts[1]);
                                            if (x && x.callReturn) return done();
                                            done(x);
                                        });
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
                outcome: "1",
                max_value: 1
            });
        });
    }
});
