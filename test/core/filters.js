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

function buyShares() {
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
            augur.filters.stop_heartbeat(true);
            throw r;
        }
    });
}

function sellShares() {
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
            augur.filters.stop_heartbeat(true);
            throw r;
        }
    });
}

describe("price listener", function () {

    var listeners = [];

    it("should find message after buyShares", function (done) {
        this.timeout(constants.TIMEOUT);

        augur.filters.start_price_listener("updatePrice", function (filter_id) {

            // poll contracts filter
            listeners.push(setInterval(function () {
                augur.filters.poll_price_listener(function (data) {
                    if (data) {
                        if (data.error) {
                            done(data);
                        } else {
                            clearInterval(listeners[listeners.length - 1]);
                            augur.filters.clear_price_filter(function () {
                                assert.isObject(data);
                                assert.property(data, "user");
                                assert.property(data, "marketId");
                                assert.property(data, "outcome");
                                assert.property(data, "price");
                                assert.property(data, "cost");
                                assert.property(data, "blockNumber");
                                assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
                                var market = abi.bignum(data.marketId);
                                var marketplus = market.plus(abi.constants.MOD);
                                if (marketplus.lt(abi.constants.BYTES_32)) {
                                    market = marketplus;
                                }
                                assert(market.eq(abi.bignum(data.marketId)));
                                assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
                                assert.isAbove(parseInt(data.blockNumber), 0);
                                done();
                            });
                        }
                    }
                });
            }, augur.filters.PULSE));

            buyShares();
        });
    });

    it("should find message after sellShares", function (done) {
        this.timeout(constants.TIMEOUT);

        augur.filters.start_price_listener("updatePrice", function (filter_id) {

            listeners.push(setInterval(function () {
                augur.filters.poll_price_listener(function (data) {
                    if (data) {
                        if (data.error) {
                            done(data);
                        } else {
                            augur.filters.clear_price_filter(function () {
                                assert.isObject(data);
                                assert.property(data, "user");
                                assert.property(data, "marketId");
                                assert.property(data, "outcome");
                                assert.property(data, "price");
                                assert.property(data, "cost");
                                assert.property(data, "blockNumber");
                                assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
                                var market = abi.bignum(data.marketId);
                                var marketplus = market.plus(abi.constants.MOD);
                                if (marketplus.lt(abi.constants.BYTES_32)) {
                                    market = marketplus;
                                }
                                assert(market.eq(abi.bignum(data.marketId)));
                                assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
                                assert.isAbove(parseInt(data.blockNumber), 0);
                                done();
                            });
                        }
                    }
                });
            }, augur.filters.PULSE));

            sellShares();
        });
    });

});

describe("contracts listener", function () {

    it("should find message after buyShares", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.filters.start_contracts_listener(function (contracts_filter) {
            assert.deepEqual(augur.filters.contracts_filter, contracts_filter);

            // poll contracts filter
            var listener = setInterval(function () {
                augur.filters.poll_contracts_listener(function (message) {
                    clearInterval(listener);

                    assert.property(message, "address");
                    assert.property(message, "topics");
                    assert.property(message, "data");
                    assert.property(message, "blockNumber");
                    assert.property(message, "logIndex");
                    assert.property(message, "blockHash");
                    assert.property(message, "transactionHash");
                    assert.property(message, "transactionIndex");
                    assert.strictEqual(
                        message.address,
                        augur.contracts.buyAndSellShares
                    );
                    assert.isArray(message.topics);
                    assert.strictEqual(message.topics.length, 4);
                    assert.isArray(message.data);
                    assert.strictEqual(message.data.length, 2);
                    assert.isAbove(parseInt(message.blockNumber), 0);

                    // tear down filter
                    augur.filters.clear_contracts_filter();
                    assert.isNull(augur.filters.contracts_filter.id);
                    assert.isNull(augur.filters.contracts_filter.heartbeat);
                    done();
                });
            }, augur.filters.PULSE);

            setTimeout(buyShares, 2000);
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

describe("heartbeat", function () {

    it("start and stop heartbeat", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.filters.start_heartbeat({
            contracts: function (message) {
                assert.property(message, "address");
                assert.property(message, "topics");
                assert.property(message, "data");
                assert.property(message, "blockNumber");
                assert.property(message, "logIndex");
                assert.property(message, "blockHash");
                assert.property(message, "transactionHash");
                assert.property(message, "transactionIndex");
                assert.strictEqual(
                    message.address,
                    augur.contracts.buyAndSellShares
                );
                assert.isArray(message.topics);
                assert.strictEqual(message.topics.length, 4);
                assert.isArray(message.data);
                assert.strictEqual(message.data.length, 2);
                assert.isAbove(parseInt(message.blockNumber), 0);

                // stop heartbeat
                augur.filters.stop_heartbeat({
                    contracts: function () {
                        assert.isNull(augur.filters.contracts_filter.heartbeat);
                        assert.isNull(augur.filters.price_filter.heartbeat);
                        assert.isNotNull(augur.filters.contracts_filter.id);
                        assert.isNull(augur.filters.price_filter.id);

                        // tear down filters
                        augur.filters.stop_heartbeat(true, {
                            contracts: function () {
                                assert.isNull(augur.filters.contracts_filter.heartbeat);
                                assert.isNull(augur.filters.price_filter.heartbeat);
                                assert.isNull(augur.filters.contracts_filter.id);
                                assert.isNull(augur.filters.price_filter.id);
                                done();
                            }
                        });
                    }
                });
            }
        });
        setTimeout(buyShares, 2000);
    });

});
