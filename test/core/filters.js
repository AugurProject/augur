(function () {
/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

var DELAY = 5000;
var branch = augur.branches.dev;
var markets = augur.getMarkets(branch);
var market_id = markets[markets.length - 1];
var outcome = "1";
var amount = "10";
var sellAmount = (Number(amount) / 2).toString();
var newMarketId;

function buyShares(done, augur) {
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
        onFailed: done
    });
}

function sellShares(done, augur) {
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
        onFailed: done
    });
}

function createMarket(done, augur) {
    var description = Math.random().toString(36).substring(4);
    augur.createEvent({
        branchId: branch,
        description: description,
        expDate: augur.rpc.blockNumber() + 2500,
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2,
        onSent: function (r) {

        },
        onSuccess: function (r) {
            augur.createMarket({
                branchId: augur.branches.dev,
                description: description,
                alpha: "0.0079",
                initialLiquidity: 10,
                tradingFee: "0.02",
                events: [ r.callReturn ],
                onSent: function (res) {
                    newMarketId = res.callReturn;
                },
                onSuccess: function (res) {

                },
                onFailed: done
            }); // createMarket
        },
        onFailed: done
    }); // createEvent
}

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("Price listener", function () {

        var listeners = [];

        it("should find message after buyShares", function (done) {
            this.timeout(constants.TIMEOUT*4);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));

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

                setTimeout(function () { buyShares(done, augur); }, DELAY);
            });
        });

        it("should find message after sellShares", function (done) {
            this.timeout(constants.TIMEOUT*4);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            augur.filters.start_price_listener("updatePrice", function (filter_id) {

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

                setTimeout(function () { sellShares(done, augur); }, DELAY);
            });
        });

    });

    describe("Contracts listener", function () {

        it("should find message after buyShares", function (done) {
            this.timeout(constants.TIMEOUT*4);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
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

                setTimeout(function () { buyShares(done, augur); }, DELAY);
            });
        });

    });
}

describe("Creation blocks", function () {

    it("getCreationBlocks(" + branch + ")", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.getCreationBlocks(branch, function (blocks) {
            assert.isObject(blocks);
            assert.property(blocks, market_id);
            assert.isNumber(blocks[market_id]);
            assert.isAbove(blocks[market_id], 0);
            done();
        });
    });

    it("getMarketCreationBlock(" + market_id + ")", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.getMarketCreationBlock(market_id, function (blockNumber) {
            assert.isNumber(blockNumber);
            assert.isAbove(blockNumber, 0);
            done();
        });
    });

});

describe("Price history", function () {

    it("getPriceHistory(" + branch + ")", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.getPriceHistory(branch, function (priceHistory) {
            if (priceHistory.error) done(priceHistory);
            assert.isObject(priceHistory);
            if (!process.env.CONTINUOUS_INTEGRATION) {
                assert.property(priceHistory, market_id);
                assert.property(priceHistory[market_id], outcome);
                assert.isArray(priceHistory[market_id][outcome]);
                assert.isAbove(priceHistory[market_id][outcome].length, 0);
                assert.property(priceHistory[market_id][outcome][0], "price");
                assert.property(priceHistory[market_id][outcome][0], "cost");
                assert.property(priceHistory[market_id][outcome][0], "blockNumber");
                assert.property(priceHistory[market_id][outcome][0], "market");
                assert.property(priceHistory[market_id][outcome][0], "user");
                assert.isAbove(priceHistory[market_id][outcome][0].market.length, 65);
                assert.strictEqual(priceHistory[market_id][outcome][0].user.length, 42);
            }
            done();
        });
    });

    if (!process.env.CONTINUOUS_INTEGRATION) {

        it("[async] getMarketPriceHistory(" + market_id + ")", function (done) {
            this.timeout(constants.TIMEOUT*4);
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
                        assert.property(logs[0], "market");
                        assert.property(logs[0], "user");
                        assert.isAbove(logs[0].market.length, 65);
                        assert.strictEqual(logs[0].user.length, 42);
                        done();
                    });
                },
                onFailed: function (r) {
                    done(r);
                }
            });
        });

        it("[sync] getMarketPriceHistory(" + market_id + ")", function () {
            this.timeout(constants.TIMEOUT);
            var logs = augur.getMarketPriceHistory(market_id, outcome);
            assert.isArray(logs);
            assert.property(logs, "length");
            assert.isAbove(logs.length, 0);
            assert.property(logs[0], "price");
            assert.property(logs[0], "blockNumber");
            assert.property(logs[0], "market");
            assert.property(logs[0], "user");
            assert.isAbove(logs[0].market.length, 65);
            assert.strictEqual(logs[0].user.length, 42);
        });

    }

});

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("listen/ignore", function () {

        it("block filter", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            augur.filters.listen({
                block: function (blockHash) {
                    // example:
                    // 0x999553c632fa10f3eb2af9a2be9ab612726372721680e3f76441f75f7c879a2f
                    assert.strictEqual(blockHash.slice(0, 2), "0x");
                    assert.strictEqual(blockHash.length, 66);
                    assert.isNull(augur.filters.contracts_filter.heartbeat);
                    assert.isNull(augur.filters.price_filter.heartbeat);
                    assert.isNotNull(augur.filters.block_filter.heartbeat);
                    assert.isNull(augur.filters.contracts_filter.id);
                    assert.isNull(augur.filters.price_filter.id);
                    assert.isNotNull(augur.filters.block_filter.id);

                    // stop heartbeat and tear down filters
                    augur.filters.ignore(true, {
                        block: function () {
                            assert.isNull(augur.filters.contracts_filter.heartbeat);
                            assert.isNull(augur.filters.price_filter.heartbeat);
                            assert.isNull(augur.filters.block_filter.heartbeat);
                            assert.isNull(augur.filters.contracts_filter.id);
                            assert.isNull(augur.filters.price_filter.id);
                            assert.isNull(augur.filters.block_filter.id);
                            done();
                        }
                    });
                }
            });
            setTimeout(function () { buyShares(done, augur); }, DELAY);
        });

        it("contracts filter", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            augur.filters.listen({
                contracts: function (tx) {
                    // { address: '0xc1c4e2f32e4b84a60b8b7983b6356af4269aab79',
                    //   topics: 
                    //    [ '0x1a653a04916ffd3d6f74d5966492bda358e560be296ecf5307c2e2c2fdedd35a',
                    //      '0x00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
                    //      '0x3557ce85d2ac4bcd36be7f3a6e0f63cfa6b18d34908b810ed41e44aafb399b44',
                    //      '0x0000000000000000000000000000000000000000000000000000000000000001' ],
                    //   data: 
                    //    [ '0x000000000000000000000000000000000000000000000001000000000000d330',
                    //      '0xfffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffa3' ],
                    //   blockNumber: '0x110d',
                    //   logIndex: '0x0',
                    //   blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    //   transactionHash: '0x8481c76a1f88a203191c1cd1942963ff9f1ea31b1db02f752771fef30133798e',
                    //   transactionIndex: '0x0' }
                    assert.property(tx, "address");
                    assert.property(tx, "topics");
                    assert.property(tx, "data");
                    assert.property(tx, "blockNumber");
                    assert.property(tx, "logIndex");
                    assert.property(tx, "blockHash");
                    assert.property(tx, "transactionHash");
                    assert.property(tx, "transactionIndex");
                    assert.strictEqual(
                        tx.address,
                        augur.contracts.buyAndSellShares
                    );
                    assert.isArray(tx.topics);
                    assert.strictEqual(tx.topics.length, 4);
                    assert.isArray(tx.data);
                    assert.strictEqual(tx.data.length, 2);
                    assert.isAbove(parseInt(tx.blockNumber), 0);
                    assert.isAbove(parseInt(augur.filters.contracts_filter.id), 0);

                    // stop heartbeat
                    augur.filters.ignore({
                        contracts: function () {
                            assert.isNull(augur.filters.contracts_filter.heartbeat);
                            assert.isNull(augur.filters.price_filter.heartbeat);
                            assert.isNull(augur.filters.block_filter.heartbeat);
                            assert.isNotNull(augur.filters.contracts_filter.id);
                            assert.isNull(augur.filters.price_filter.id);
                            assert.isNull(augur.filters.block_filter.id);

                            // tear down filters
                            augur.filters.ignore(true, {
                                contracts: function () {
                                    assert.isNull(augur.filters.contracts_filter.heartbeat);
                                    assert.isNull(augur.filters.price_filter.heartbeat);
                                    assert.isNull(augur.filters.block_filter.heartbeat);
                                    assert.isNull(augur.filters.contracts_filter.id);
                                    assert.isNull(augur.filters.price_filter.id);
                                    assert.isNull(augur.filters.block_filter.id);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
            setTimeout(function () { buyShares(done, augur); }, DELAY);
        });

        it("price filter", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            augur.filters.listen({
                price: function (update) {
                    // { user: '0x00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
                    //   marketId: '-0xcaa8317a2d53b432c94180c591f09c30594e72cb6f747ef12be1bb5504c664bc',
                    //   outcome: '1',
                    //   price: '1.00000000000000002255',
                    //   cost: '-1.00000000000000008137',
                    //   blockNumber: '4722' }
                    assert.property(update, "user");
                    assert.property(update, "marketId");
                    assert.property(update, "outcome");
                    assert.property(update, "price");
                    assert.property(update, "cost");
                    assert.property(update, "blockNumber");
                    assert.isAbove(parseInt(update.blockNumber), 0);
                    assert.strictEqual(update.outcome, outcome);
                    assert(abi.bignum(update.user).eq(abi.bignum(augur.coinbase)));
                    assert.isAbove(parseInt(augur.filters.price_filter.id), 0);
                    assert.isNull(augur.filters.contracts_filter.heartbeat);
                    assert.isNotNull(augur.filters.price_filter.heartbeat);
                    assert.isNull(augur.filters.block_filter.heartbeat);
                    assert.isNull(augur.filters.contracts_filter.id);
                    assert.isNotNull(augur.filters.price_filter.id);
                    assert.isNull(augur.filters.block_filter.id);

                    // stop heartbeat and tear down filters
                    augur.filters.ignore(true, {
                        price: function () {
                            assert.isNull(augur.filters.contracts_filter.heartbeat);
                            assert.isNull(augur.filters.price_filter.heartbeat);
                            assert.isNull(augur.filters.block_filter.heartbeat);
                            assert.isNull(augur.filters.contracts_filter.id);
                            assert.isNull(augur.filters.price_filter.id);
                            assert.isNull(augur.filters.block_filter.id);
                            done();
                        }
                    });
                }
            });
            setTimeout(function () { buyShares(done, augur); }, DELAY);
        });

        it("creation filter", function (done) {
            this.timeout(constants.TIMEOUT*12);
            var augur = utils.setup(utils.reset("../../src/index"), process.argv.slice(2));
            augur.filters.listen({
                creation: function (update) {
                    // log: [{
                    //   "address": "0xd2e9f7c2fd4635199b8cc9e8128fc4d27c693945",
                    //   "topics": [
                    //     "0x20a4e172725965b86bd8a626ee70f94c0e142ef8c81c890e7f538a1ce4e6dbe9",
                    //     "0x9a45a563d24fdb20a322b24ce5fcbc9f78a71420329640b14e7ef288afd46cd2"
                    //   ],
                    //   "data": "0x",
                    //   "blockNumber": "0x503e",
                    //   "logIndex": "0x0",
                    //   "blockHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                    //   "transactionHash": "0x7736943bad9462461af6d9c8a1e40f38566a7ac59910c9a655424c86cc4c7754",
                    //   "transactionIndex": "0x0"
                    // }, ...]
                    //
                    // update: {
                    //   "marketId": "-0x65ba5a9c2db024df5cdd4db31a0343608758ebdfcd69bf4eb1810d77502b932e",
                    //   "blockNumber": "20542"
                    // }
                    assert.property(update, "marketId");
                    assert.property(update, "blockNumber");
                    assert.isAbove(parseInt(update.blockNumber), 0);
                    assert.strictEqual(update.marketId, newMarketId);
                    assert.isAbove(parseInt(augur.filters.creation_filter.id), 0);
                    assert.isNull(augur.filters.contracts_filter.heartbeat);
                    assert.isNull(augur.filters.price_filter.heartbeat);
                    assert.isNull(augur.filters.block_filter.heartbeat);
                    assert.isNotNull(augur.filters.creation_filter.heartbeat);
                    assert.isNull(augur.filters.contracts_filter.id);
                    assert.isNull(augur.filters.price_filter.id);
                    assert.isNull(augur.filters.block_filter.id);
                    assert.isNotNull(augur.filters.creation_filter.id);

                    // stop heartbeat and tear down filters
                    augur.filters.ignore(true, {
                        creation: function () {
                            assert.isNull(augur.filters.contracts_filter.heartbeat);
                            assert.isNull(augur.filters.price_filter.heartbeat);
                            assert.isNull(augur.filters.block_filter.heartbeat);
                            assert.isNull(augur.filters.creation_filter.heartbeat);
                            assert.isNull(augur.filters.contracts_filter.id);
                            assert.isNull(augur.filters.price_filter.id);
                            assert.isNull(augur.filters.block_filter.id);
                            assert.isNull(augur.filters.creation_filter.id);
                            done();
                        }
                    });
                }
            });
            setTimeout(function () { createMarket(done, augur); }, DELAY);
        });

        it("combined", function (done) {
            this.timeout(constants.TIMEOUT*12);
            var augur = utils.setup(utils.reset("../../src/index"), process.argv.slice(2));

            // stop heartbeat and tear down filters
            function teardown(done) {
                var down = {
                    block: null,
                    contracts: null,
                    price: null,
                    creation: null
                };
                augur.filters.ignore(true, {
                    block: function () {
                        assert.isNull(augur.filters.block_filter.heartbeat);
                        assert.isNull(augur.filters.block_filter.id);
                        down.block = true;
                        if (down.contracts && down.price && down.creation) done();
                    },
                    contracts: function () {
                        assert.isNull(augur.filters.contracts_filter.heartbeat);
                        assert.isNull(augur.filters.contracts_filter.id);
                        down.contracts = true;
                    },
                    price: function () {
                        assert.isNull(augur.filters.price_filter.heartbeat);
                        assert.isNull(augur.filters.price_filter.id);
                        down.price = true;
                    },
                    creation: function () {
                        assert.isNull(augur.filters.creation_filter.heartbeat);
                        assert.isNull(augur.filters.creation_filter.id);
                        down.creation = true;
                    }
                });
            }

            var checkbox = {
                block: null,
                contracts: null,
                price: null,
                creation: null
            };
            augur.filters.listen({
                block: function (blockHash) {
                    assert.strictEqual(blockHash.slice(0, 2), "0x");
                    assert.strictEqual(blockHash.length, 66);
                    assert.isNotNull(augur.filters.block_filter.heartbeat);
                    assert.isNotNull(augur.filters.block_filter.id);
                    checkbox.block = true;
                    if (checkbox.contracts && checkbox.price && checkbox.creation) {
                        teardown(done);
                    }
                },
                contracts: function (tx) {
                    assert.property(tx, "address");
                    assert.property(tx, "topics");
                    assert.property(tx, "data");
                    assert.property(tx, "blockNumber");
                    assert.property(tx, "logIndex");
                    assert.property(tx, "blockHash");
                    assert.property(tx, "transactionHash");
                    assert.property(tx, "transactionIndex");
                    assert.isAbove(parseInt(tx.blockNumber), 0);
                    assert.isAbove(parseInt(augur.filters.contracts_filter.id), 0);
                    checkbox.contracts = true;
                    if (checkbox.block && checkbox.price && checkbox.creation) {
                        teardown(done);
                    }
                },
                price: function (update) {
                    assert.property(update, "user");
                    assert.property(update, "marketId");
                    assert.property(update, "outcome");
                    assert.property(update, "price");
                    assert.property(update, "cost");
                    assert.property(update, "blockNumber");
                    assert.isAbove(parseInt(update.blockNumber), 0);
                    assert.strictEqual(update.outcome, outcome);
                    assert(abi.bignum(update.user).eq(abi.bignum(augur.coinbase)));
                    assert.isAbove(parseInt(augur.filters.price_filter.id), 0);
                    assert.isNotNull(augur.filters.price_filter.heartbeat);
                    assert.isNotNull(augur.filters.price_filter.id);
                    checkbox.price = true;
                    if (checkbox.contracts && checkbox.block && checkbox.creation) {
                        teardown(done);
                    }
                },
                creation: function (update) {
                    assert.property(update, "marketId");
                    assert.property(update, "blockNumber");
                    assert.isAbove(parseInt(update.blockNumber), 0);
                    assert.strictEqual(update.marketId, newMarketId);
                    assert.isAbove(parseInt(augur.filters.creation_filter.id), 0);
                    assert.isNotNull(augur.filters.creation_filter.heartbeat);
                    assert.isNotNull(augur.filters.creation_filter.id);
                    checkbox.creation = true;
                    if (checkbox.contracts && checkbox.price && checkbox.block) {
                        teardown(done);
                    }
                }
            });
            setTimeout(function () { buyShares(done, augur); }, DELAY);
            setTimeout(function () { createMarket(done, augur); }, DELAY);
        });

    });

}

})();
