/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var chalk = require("chalk");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = require(augurpath);
var DEBUG = false;

var marketInfo = {
    network: '10101',
    traderCount: 0,
    alpha: '0.00790000000000000001',
    traderIndex: 0,
    numOutcomes: 2,
    tradingPeriod: 20516,
    tradingFee: '0.01999999999999999998',
    branchId: '0xf69b5',
    numEvents: 1,
    cumulativeScale: '1',
    creationFee: '50',
    author: '0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
    type: 'binary',
    endDate: 2051633,
    participants: {},
    winningOutcomes: [ '0', '0', '0', '0', '0', '0', '0', '0' ],
    description: 'Will it rain in New York City on November 12, 2016?',
    outcomes: 
    [ { shares: {},
       id: 1,
       outstandingShares: '49.45834577571241539126',
       price: '0.50548562594758728039' },
     { shares: {},
       id: 2,
       outstandingShares: '49.45834577571241539126',
       price: '0.50548562594758728039' } ],
    events: 
    [ { id: '-0x7acc522f7964e0b258b63ae321b3b3cad3863086af2ba6c6d9ed32e56eb866d1',
       endDate: 2051633,
       outcome: '0',
       minValue: '1',
       maxValue: '2',
       numOutcomes: 2,
       type: 'binary' } ],
    price: '0.50548562594758728039',
    _id: '-0x5b91755f722e2f95c5fff056c73faaaca986d82eeb9d09bd30ff443b65e9cc2d'
};

if (!process.env.CONTINUOUS_INTEGRATION) {

    beforeEach(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    var amount = 1;
    var outcome = 2;

    it("lsLmsr", function () {
        var cost = augur.lsLmsr(marketInfo);
        assert.strictEqual(parseFloat(cost).toFixed(4), "50.0000");
    });

    it("price", function () {
        var price = augur.price(marketInfo, outcome);
        assert.strictEqual(parseFloat(price).toFixed(4), "0.5055");
    });

    it("getSimulatedBuy", function () {
        var simulatedBuy = augur.getSimulatedBuy(marketInfo, outcome, amount);
        assert.isArray(simulatedBuy);
        assert.strictEqual(simulatedBuy.length, 2);
        assert.strictEqual(parseFloat(simulatedBuy[0]).toFixed(8), "0.65425639");
        assert.strictEqual(parseFloat(simulatedBuy[1]).toFixed(8), "0.78436838");
    });

    it("getSimulatedSell", function () {
        marketInfo
        var simulatedSell = augur.getSimulatedSell(marketInfo, outcome, amount);
        assert.isArray(simulatedSell);
        assert.strictEqual(simulatedSell.length, 2);
        assert.strictEqual(parseFloat(simulatedSell[0]).toFixed(8), "0.35812488");
        assert.strictEqual(parseFloat(simulatedSell[1]).toFixed(8), "0.21950285");
    });

    describe("makeMarketHash", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var params = [
                    t.market,
                    t.outcome,
                    abi.fix(t.amount, "hex"),
                    (t.limit) ? abi.fix(t.limit, "hex") : 0
                ];
                var localHash = augur.makeMarketHash(t);
                var contractHash = augur.fire({
                    to: augur.contracts.buyAndSellShares,
                    method: "makeMarketHash",
                    signature: "iiii",
                    returns: "hash",
                    params: params
                });
                assert.strictEqual(abi.hex(localHash), abi.hex(contractHash));
            });
        };
        test({
            market: marketInfo._id,
            outcome: 1,
            amount: 1,
            limit: 0
        });
        test({
            market: marketInfo._id,
            outcome: 1,
            amount: 1,
            limit: "0.45"
        });
        test({
            market: marketInfo._id,
            outcome: 2,
            amount: "2.6",
            limit: 0
        });
        test({
            market: "0xdeadbeef",
            outcome: 2,
            amount: 50,
            limit: "0.45"
        });
        test({
            market: "0xdeadbeef",
            outcome: 150,
            amount: 100000,
            limit: "0.99995"
        });
    });

    describe("commitTrade", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var hash = augur.makeMarketHash(t);
                augur.commitTrade({
                    market: t.market,
                    hash: hash,
                    onSent: function (res) {
                        assert(res.txHash);
                        assert.strictEqual(res.callReturn, "1");
                    },
                    onSuccess: function (res) {
                        assert(res.txHash);
                        assert.strictEqual(res.callReturn, "1");
                        done();
                    },
                    onFailed: done
                });
            });
        };
        test({
            market: marketInfo._id,
            outcome: 1,
            amount: 1,
            limit: 0
        });
        test({
            market: marketInfo._id,
            outcome: 1,
            amount: 1,
            limit: "0.45"
        });
        test({
            market: marketInfo._id,
            outcome: 2,
            amount: "2.6",
            limit: 0
        });
        test({
            market: "0xdeadbeef",
            outcome: 2,
            amount: 50,
            limit: "0.45"
        });
        test({
            market: "0xdeadbeef",
            outcome: 150,
            amount: 100000,
            limit: "0.99995"
        });
    });

    it("Look up / sanity check most recent market ID", function (done) {
        augur.getMarketsInBranch(augur.branches.dev, function (markets) {
            if (markets.error) return done(markets);
            assert.instanceOf(markets, Array);
            assert.isAbove(markets.length, 0);
            var marketId = markets[markets.length - 1];
            assert.isDefined(marketId);
            assert.isNotNull(marketId);
            done();
        });
    });

    describe("Buy and sell shares", function () {

        var test = function (t) {
            var label = (t.scalar) ? "scalar market" : "market with " + t.numOutcomes + " outcomes";
            t.numOutcomes = t.numOutcomes || 2;
            t.numEvents = t.numEvents || 1;
            it(label, function (done) {
                this.timeout(augur.constants.TIMEOUT*4);
                var branch = augur.branches.dev;
                augur.getMarketsInBranch(branch, function (markets) {
                    markets.reverse();
                    async.eachSeries(markets, function (market, nextMarket) {
                        augur.getMarketEvents(market, function (events) {
                            if (t.numEvents !== events.length) return nextMarket();
                            async.eachSeries(events, function (thisEvent, nextEvent) {
                                augur.getNumOutcomes(thisEvent, function (numOutcomes) {
                                    numOutcomes = parseInt(numOutcomes);
                                    if (numOutcomes !== t.numOutcomes) {
                                        return nextEvent();
                                    }
                                    augur.getMaxValue(thisEvent, function (maxValue) {
                                        maxValue = abi.number(maxValue);
                                        if (t.scalar && maxValue === 2) {
                                            return nextEvent();
                                        }
                                        if (!t.scalar && t.numOutcomes === 2 && maxValue !== 2) {
                                            return nextEvent();
                                        }
                                        nextEvent({event: thisEvent, market: market});
                                    });
                                });
                            }, function (found) {
                                if (found && found.event) return nextMarket(found);
                                nextMarket();
                            });
                        });
                    }, function (found) {
                        if (!found) return done(new Error("couldn't find market"));
                        if (!found.market) return done(found);
                        augur.getMarketInfo(found.market, function (info) {
                            if (!info) return done(new Error("couldn't get market info"));
                            if (!info.events || !info.events.length) return done(info);
                            var minValue = abi.number(info.events[0].minValue);
                            var maxValue = abi.number(info.events[0].maxValue);
                            var numOutcomes = info.events[0].numOutcomes;
                            var outcomeRange = utils.linspace(1, numOutcomes, numOutcomes);
                            var outcome = utils.select_random(outcomeRange);
                            var initialSharesPurchased = abi.number(info.outcomes[outcome - 1].outstandingShares);
                            var myInitialShares = abi.number(info.outcomes[outcome - 1].shares[augur.from]);
                            var marketHash = augur.makeMarketHash({
                                market: found.market,
                                outcome: outcome,
                                amount: amount,
                                limit: 0
                            });
                            augur.commitTrade({
                                market: found.market,
                                hash: marketHash,
                                onSent: function (res) {
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onSuccess: function (res) {
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                    augur.rpc.blockNumber(function (thisBlock) {
                                        thisBlock = parseInt(thisBlock);
                                        (function waitForNextBlock() {
                                            augur.rpc.blockNumber(function (nextBlock) {
                                                nextBlock = parseInt(nextBlock);
                                                if (thisBlock === nextBlock) {
                                                    return setTimeout(waitForNextBlock, 3000);
                                                }
                                                augur.buyShares({
                                                    branchId: branch,
                                                    marketId: found.market,
                                                    outcome: outcome,
                                                    amount: amount,
                                                    limit: 0,
                                                    onSent: function (r) {
                                                        assert.isObject(r);
                                                        assert.isNotNull(r.callReturn);
                                                        assert.isNotNull(r.txHash);
                                                        assert.strictEqual(r.callReturn, "1");
                                                    },
                                                    onSuccess: function (r) {
                                                        assert.isObject(r);
                                                        assert.isNotNull(r.callReturn);
                                                        assert.strictEqual(r.callReturn, "1");
                                                        assert.isString(r.txHash);
                                                        assert.isString(r.blockHash);
                                                        assert.isNotNull(r.blockNumber);
                                                        assert.isAbove(abi.number(r.blockNumber), 0);
                                                        var marketInfo = augur.getMarketInfo(found.market);
                                                        var afterBuySharesPurchased = abi.number(marketInfo.outcomes[outcome - 1].outstandingShares);
                                                        var myAfterBuyShares = abi.number(marketInfo.outcomes[outcome - 1].shares[augur.from]);
                                                        assert.strictEqual(afterBuySharesPurchased - initialSharesPurchased, amount);
                                                        assert.strictEqual(myAfterBuyShares - myInitialShares, amount);
                                                        var marketHash = augur.makeMarketHash({
                                                            market: found.market,
                                                            outcome: outcome,
                                                            amount: amount,
                                                            limit: 0
                                                        });
                                                        augur.commitTrade({
                                                            market: found.market,
                                                            hash: marketHash,
                                                            onSent: function (res) {
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                            },
                                                            onSuccess: function (res) {
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                                augur.rpc.blockNumber(function (thisBlock) {
                                                                    thisBlock = parseInt(thisBlock);
                                                                    (function waitABlock() {
                                                                        augur.rpc.blockNumber(function (nextBlock) {
                                                                            nextBlock = parseInt(nextBlock);
                                                                            if (thisBlock === nextBlock) {
                                                                                return setTimeout(waitABlock, 3000);
                                                                            }
                                                                            augur.sellShares({
                                                                                branchId: branch,
                                                                                marketId: found.market,
                                                                                outcome: outcome,
                                                                                amount: amount,
                                                                                limit: 0,
                                                                                onSent: function (r) {
                                                                                    assert.isObject(r);
                                                                                    assert.isNotNull(r.callReturn);
                                                                                    assert.isNotNull(r.txHash);
                                                                                    assert.strictEqual(r.callReturn, "1");
                                                                                },
                                                                                onSuccess: function (r) {
                                                                                    assert.isObject(r);
                                                                                    assert.isNotNull(r.callReturn);
                                                                                    assert.strictEqual(r.callReturn, "1");
                                                                                    assert.isString(r.txHash);
                                                                                    assert.isString(r.blockHash);
                                                                                    assert.isNotNull(r.blockNumber);
                                                                                    assert.isAbove(abi.number(r.blockNumber), 0);
                                                                                    var marketInfo = augur.getMarketInfo(found.market);
                                                                                    var finalSharesPurchased = abi.number(marketInfo.outcomes[outcome - 1].outstandingShares);
                                                                                    var myFinalShares = abi.number(marketInfo.outcomes[outcome - 1].shares[augur.from]);
                                                                                    assert.strictEqual(finalSharesPurchased, initialSharesPurchased);
                                                                                    assert.strictEqual(myFinalShares, myInitialShares);
                                                                                    done();
                                                                                },
                                                                                onFailed: done
                                                                            });
                                                                        });
                                                                    })();
                                                                });
                                                            },
                                                            onFailed: done
                                                        });
                                                    },
                                                    onFailed: done
                                                });
                                            });
                                        })();
                                    });
                                },
                                onFailed: done
                            });
                        });
                    });
                });
            });
        };

        test({numOutcomes: 2});
        test({numOutcomes: 3});
        test({numOutcomes: 4});
        test({numOutcomes: 9});
        test({scalar: true});
        test({numOutcomes: 2, numEvents: 3});
    });

    describe("trade", function () {

        var test = function (t) {
            var label = (t.scalar) ? "scalar market" : "market with " + t.numOutcomes + " outcomes";
            t.numOutcomes = t.numOutcomes || 2;
            t.numEvents = t.numEvents || 1;
            it(label, function (done) {
                this.timeout(augur.constants.TIMEOUT*2);
                var branch = augur.branches.dev;
                augur.getMarketsInBranch(branch, function (markets) {
                    markets.reverse();
                    async.eachSeries(markets, function (market, nextMarket) {
                        augur.getMarketEvents(market, function (events) {
                            if (t.numEvents !== events.length) return nextMarket();
                            async.eachSeries(events, function (thisEvent, nextEvent) {
                                augur.getNumOutcomes(thisEvent, function (numOutcomes) {
                                    numOutcomes = parseInt(numOutcomes);
                                    if (numOutcomes !== t.numOutcomes) {
                                        return nextEvent();
                                    }
                                    augur.getMaxValue(thisEvent, function (maxValue) {
                                        maxValue = abi.number(maxValue);
                                        if (t.scalar && maxValue === 2) {
                                            return nextEvent();
                                        }
                                        if (!t.scalar && t.numOutcomes === 2 && maxValue !== 2) {
                                            return nextEvent();
                                        }
                                        nextEvent({event: thisEvent, market: market});
                                    });
                                });
                            }, function (found) {
                                if (found && found.event) return nextMarket(found);
                                nextMarket();
                            });
                        });
                    }, function (found) {
                        if (!found) return done(new Error("couldn't find market"));
                        if (!found.market) return done(found);
                        var info = augur.getMarketInfo(found.market);
                        if (!info) return done(new Error("couldn't get market info"));
                        if (!info.events || !info.events.length) return done(info);
                        var minValue = abi.number(info.events[0].minValue);
                        var maxValue = abi.number(info.events[0].maxValue);
                        var numOutcomes = info.events[0].numOutcomes;
                        var outcomeRange = utils.linspace(1, numOutcomes, numOutcomes);
                        var outcome = utils.select_random(outcomeRange);
                        var initialSharesPurchased = abi.number(info.outcomes[outcome - 1].outstandingShares);
                        var myInitialShares = abi.number(info.outcomes[outcome - 1].shares[augur.from]);
                        if (DEBUG) {
                            console.log("initialSharesPurchased:", initialSharesPurchased);
                            console.log("myInitialShares:", myInitialShares);
                        }
                        if (!myInitialShares) myInitialShares = 0;
                        var initialBlock = parseInt(augur.rpc.blockNumber());

                        // buy shares
                        augur.trade({
                            branch: branch,
                            market: found.market,
                            outcome: outcome,
                            amount: amount,
                            limit: 0,
                            callbacks: {
                                onMarketHash: function (marketHash) {
                                    assert(marketHash);
                                    if (DEBUG) console.log("marketHash:", marketHash);
                                },
                                onCommitTradeSent: function (res) {
                                    if (DEBUG) console.log("commitTradeSent:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onCommitTradeSuccess: function (res) {
                                    if (DEBUG) console.log("commitTradeSuccess:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onCommitTradeFailed: done,
                                onNextBlock: function (blockNumber) {
                                    if (DEBUG) console.log("blockNumber:", blockNumber);
                                    assert.isAbove(blockNumber, initialBlock);
                                },
                                onTradeSent: function (res) {
                                    if (DEBUG) console.log("tradeSent:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onTradeSuccess: function (res) {
                                    if (DEBUG) console.log("tradeSuccess:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                    if (DEBUG) console.log("outcome:", outcome);
                                    if (DEBUG) console.log("amount:", amount);
                                    var marketInfo = augur.getMarketInfo(found.market);
                                    if (DEBUG) console.log("marketInfo after:", JSON.stringify(marketInfo, null, 2));
                                    if (DEBUG) console.log("afterBuySharesPurchased (unprocessed):", marketInfo.outcomes[outcome - 1].outstandingShares);
                                    var afterBuySharesPurchased = abi.number(marketInfo.outcomes[outcome - 1].outstandingShares);
                                    if (DEBUG) console.log("afterBuySharesPurchased:", afterBuySharesPurchased);
                                    var myAfterBuyShares = abi.number(marketInfo.outcomes[outcome - 1].shares[augur.from]);
                                    if (DEBUG) console.log("myAfterBuyShares:", myAfterBuyShares);
                                    if (DEBUG) console.log(afterBuySharesPurchased - initialSharesPurchased, amount);
                                    if (DEBUG) console.log(myAfterBuyShares - myInitialShares, amount);
                                    assert.strictEqual(afterBuySharesPurchased - initialSharesPurchased, amount);
                                    assert.strictEqual(myAfterBuyShares - myInitialShares, amount);

                                    // sell shares
                                    augur.trade({
                                        branch: branch,
                                        market: found.market,
                                        outcome: outcome,
                                        amount: -amount,
                                        limit: 0,
                                        callbacks: {
                                            onMarketHash: function (marketHash) {
                                                assert(marketHash);
                                            },
                                            onCommitTradeSent: function (res) {
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                            },
                                            onCommitTradeSuccess: function (res) {
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                            },
                                            onCommitTradeFailed: done,
                                            onNextBlock: function (blockNumber) {
                                                assert.isAbove(blockNumber, initialBlock);
                                            },
                                            onTradeSent: function (res) {
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                            },
                                            onTradeSuccess: function (res) {
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                                var marketInfo = augur.getMarketInfo(found.market);
                                                var finalSharesPurchased = abi.number(marketInfo.outcomes[outcome - 1].outstandingShares);
                                                var myFinalShares = abi.number(marketInfo.outcomes[outcome - 1].shares[augur.from]);
                                                assert.strictEqual(finalSharesPurchased, initialSharesPurchased);
                                                assert.strictEqual(myFinalShares, myInitialShares);
                                                done();
                                            },
                                            onTradeFailed: done
                                        }
                                    });
                                },
                                onTradeFailed: done
                            }
                        });
                    });
                });
            });
        };

        test({numOutcomes: 2});
        test({numOutcomes: 3});
        test({numOutcomes: 4});
        test({numOutcomes: 9});
        test({scalar: true});
        test({numOutcomes: 2, numEvents: 3});
    });
}
