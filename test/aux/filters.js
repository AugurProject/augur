/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

var branch = augur.branches.dev;
var markets = augur.getMarkets(branch);
var market_id = markets[markets.length - 1];
var outcome = "1";
var amount = "10";
var sellAmount = (Number(amount) / 2).toString();

describe("updatePrice listener", function () {

    var listeners = [];

    it("should return data on buyShares", function (done) {
        this.timeout(constants.TIMEOUT);

        augur.filters.start_eth_listener("updatePrice", function (filter_id) {

            listeners.push(setInterval(function () {
                augur.filters.poll_eth_listener("updatePrice", function (data) {
                    if (data) {
                        if (data.error) {
                            done(data);
                        } else {
                            clearInterval(listeners[listeners.length - 1]);
                            assert.isObject(data);
                            assert.property(data, "user");
                            assert.property(data, "marketId");
                            assert.property(data, "outcome");
                            assert.property(data, "price");
                            assert.property(data, "cost");
                            assert.property(data, "blockNumber");
                            assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
                            var market = abi.bignum(data.marketId[2]);
                            var marketplus = market.plus(abi.constants.MOD);
                            if (marketplus.lt(abi.constants.BYTES_32)) {
                                market = marketplus;
                            }
                            assert(market.eq(abi.bignum(data.marketId[2])));
                            assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
                            assert.isAbove(parseInt(data.blockNumber), 0);
                            done();
                        }
                    }
                });
            }, 2000));

            augur.buyShares({
                branchId: branch,
                marketId: market_id,
                outcome: outcome,
                amount: amount,
                onSent: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                },
                onSuccess: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                    assert.property(r, "blockHash");
                    assert.property(r, "blockNumber");
                    assert.isAbove(parseInt(r.blockNumber), 0);
                    assert.strictEqual(r.from, augur.coinbase);
                    assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                    assert.strictEqual(parseInt(r.value), 0);
                },
                onFailed: function (r) {
                    done(r);
                }
            });

        });
    });

    it("should return data on sellShares", function (done) {
        this.timeout(constants.TIMEOUT);

        augur.filters.start_eth_listener("updatePrice", function (filter_id) {

            listeners.push(setInterval(function () {
                augur.filters.poll_eth_listener("updatePrice", function (data) {
                    if (data) {
                        if (data.error) {
                            done(data);
                        } else {
                            clearInterval(listeners[listeners.length - 1]);
                            assert.isObject(data);
                            assert.property(data, "user");
                            assert.property(data, "marketId");
                            assert.property(data, "outcome");
                            assert.property(data, "price");
                            assert.property(data, "cost");
                            assert.property(data, "blockNumber");
                            assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
                            var market = abi.bignum(data.marketId[2]);
                            var marketplus = market.plus(abi.constants.MOD);
                            if (marketplus.lt(abi.constants.BYTES_32)) {
                                market = marketplus;
                            }
                            assert(market.eq(abi.bignum(data.marketId[2])));
                            assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
                            assert.isAbove(parseInt(data.blockNumber), 0);
                            done();
                        }
                    }
                });
            }, 2000));

            augur.sellShares({
                branchId: branch,
                marketId: market_id,
                outcome: outcome,
                amount: sellAmount,
                onSent: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                },
                onSuccess: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                    assert.property(r, "blockHash");
                    assert.property(r, "blockNumber");
                    assert.isAbove(parseInt(r.blockNumber), 0);
                    assert.strictEqual(r.from, augur.coinbase);
                    assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                    assert.strictEqual(parseInt(r.value), 0);
                },
                onFailed: function (r) {
                    done(r);
                }
            });

        });
    });

});

describe("getMarketPriceHistory", function () {

    it("[async] price history after buy", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
            },
            onSuccess: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, augur.coinbase);
                assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                assert.strictEqual(parseInt(r.value), 0);
                augur.getMarketPriceHistory(market_id, outcome, function (logs) {
                    assert.isArray(logs);
                    assert.property(logs, "length");
                    assert.isAbove(logs.length, 0);
                    assert.property(logs[0], "price");
                    assert.property(logs[0], "blockNumber");
                    done();
                });
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

    it("[sync] price history after buy", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
            },
            onSuccess: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, augur.coinbase);
                assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                assert.strictEqual(parseInt(r.value), 0);
                var logs = augur.getMarketPriceHistory(market_id, outcome);
                assert.isArray(logs);
                assert.property(logs, "length");
                assert.isAbove(logs.length, 0);
                assert.property(logs[0], "price");
                assert.property(logs[0], "blockNumber");
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

    it("[async] price history after sell", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.sellShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: sellAmount,
            onSent: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
            },
            onSuccess: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, augur.coinbase);
                assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                assert.strictEqual(parseInt(r.value), 0);
                augur.getMarketPriceHistory(market_id, outcome, function (logs) {
                    assert.isArray(logs);
                    assert.property(logs, "length");
                    assert.isAbove(logs.length, 0);
                    assert.property(logs[0], "price");
                    assert.property(logs[0], "blockNumber");
                    done();
                });
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

    it("[sync] price history after sell", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.sellShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: sellAmount,
            onSent: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
            },
            onSuccess: function (r) {
                assert.property(r, "txHash");
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, augur.coinbase);
                assert.strictEqual(r.to, augur.contracts.buyAndSellShares);
                assert.strictEqual(parseInt(r.value), 0);
                var logs = augur.getMarketPriceHistory(market_id, outcome);
                assert.isArray(logs);
                assert.property(logs, "length");
                assert.isAbove(logs.length, 0);
                assert.property(logs[0], "price");
                assert.property(logs[0], "blockNumber");
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

});
