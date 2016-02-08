/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));

var branchId = augur.branches.dev;
var markets = augur.getMarketsInBranch(branchId);
var marketId = markets[markets.length - 1];

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("initial data load", function () {

        describe("most active markets", function () {
            var test = function (node) {
                assert.isObject(node);
                assert.property(node, "nodeId");
                assert.property(node, "nodeType");
                assert.strictEqual(node.nodeType, "CONTRACT");
                assert.property(node, "name");
                assert.isString(node.name);
                assert.property(node, "childNodes");
                assert.isNull(node.childNodes);
                assert.property(node, "id");
                assert.isString(node.id);
                assert.property(node, "eventName");
                assert.isString(node.eventName);
                assert.strictEqual(node.name, node.eventName);
                assert.property(node, "imagePath");
                assert.isNull(node.imagePath);
                assert.property(node, "displayOrder");
                assert.isNumber(node.displayOrder);
                assert.property(node, "tickSize");
                assert.isNumber(node.tickSize);
                assert.property(node, "tickValue");
                assert.isNumber(node.tickValue);
                assert.property(node, "lastTradePrice");
                assert.isNumber(node.lastTradePrice);
                assert.property(node, "lastTradePriceFormatted");
                assert.isString(node.lastTradePriceFormatted);
                assert.property(node, "lastTradeCostPerShare");
                assert.isNumber(node.lastTradeCostPerShare);
                assert.property(node, "lastTradeCostPerShareFormatted");
                assert.isString(node.lastTradeCostPerShareFormatted);
                assert.property(node, "sessionChangePrice");
                assert.strictEqual(node.sessionChangePrice, 0.0);
                assert.property(node, "sessionChangePriceFormatted");
                assert.strictEqual(node.sessionChangePriceFormatted, "+0.0");
                assert.property(node, "sessionChangeCostPerShare");
                assert.strictEqual(node.sessionChangeCostPerShare, 0.0);
                assert.property(node, "sessionChangeCostPerShareFormatted");
                assert.strictEqual(node.sessionChangeCostPerShareFormatted, "0.00 CASH");
                assert.property(node, "totalVolume");
                assert.isNumber(node.totalVolume);
                assert.isAbove(node.totalVolume, 0);
                assert.property(node, "bestBidPrice");
                assert.isNumber(node.bestBidPrice);
                assert.property(node, "bestAskPrice");
                assert.isNumber(node.bestAskPrice);
                assert.strictEqual(node.bestBidPrice, node.bestAskPrice);
                assert.strictEqual(node.bestBidPrice, node.lastTradePrice);
                assert.property(node, "leaf");
                assert.isTrue(node.leaf);
            };
            var callback = function (mostActive, done) {
                var node, prevVolume;
                for (var i = 0, len = mostActive.childNodes.length; i < len; ++i) {
                    node = mostActive.childNodes[i];
                    if (i > 0) assert(prevVolume >= node.totalVolume);
                    prevVolume = node.totalVolume;
                    test(node);
                }
                done();
            };
            it("getMostActive(" + branchId + ")", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getMostActive(branchId, function (mostActive) {
                    callback(mostActive, done);
                });
            });
            it("getMostActive()", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getMostActive(function (mostActive) {
                    callback(mostActive, done);
                });
            });
        });

        describe("markets summary", function () {
            var test = function (node) {
                assert.isObject(node);
                assert.property(node, "id");
                assert.property(node, "name");
                assert.property(node, "lastTradePrice");
                assert.property(node, "lastTradePriceFormatted");
                assert.property(node, "lastTradeCostPerShare");
                assert.property(node, "lastTradeCostPerShareFormatted");
                assert.isString(node.name);
                assert.isNumber(node.lastTradePrice);
                assert.isString(node.lastTradePriceFormatted);
                assert.isNumber(node.lastTradeCostPerShare);
                assert.isString(node.lastTradeCostPerShareFormatted);
            };
            var callback = function (marketsSummary, done) {
                assert.isArray(marketsSummary);
                for (var i = 0, len = marketsSummary.length; i < len; ++i) {
                    test(marketsSummary[i]);
                }
                done();
            };
            it("getMarketsSummary(" + branchId + ")", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getMarketsSummary(branchId, function (marketsSummary) {
                    callback(marketsSummary, done);
                });
            });
            it("getMarketsSummary()", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getMarketsSummary(function (marketsSummary) {
                    callback(marketsSummary, done);
                });
            });
        });

        describe("getMarketsInfo", function () {
            var test = function (info, options, done) {
                if (utils.is_function(options) && !done) {
                    done = options;
                    options = undefined;
                }
                options = options || {};
                assert.isObject(info);
                var numMarkets = options.numMarkets || parseInt(augur.getNumMarkets(branchId));
                var market;
                assert.strictEqual(Object.keys(info).length, numMarkets);
                for (var marketId in info) {
                    if (!info.hasOwnProperty(marketId)) continue;
                    market = info[marketId];
                    assert.isArray(market.events);
                    assert.isAbove(market.events.length, 0);
                    assert.isString(market.type);
                    assert(market.type === "binary" ||
                           market.type === "categorical" ||
                           market.type === "scalar" ||
                           market.type === "combinatorial");
                    if (market.type === "combinatorial") {
                        for (var i = 0; i < market.numEvents; ++i) {
                            assert.isNumber(market.events[i].endDate);
                            assert.isString(market.events[i].id);
                            if (options.combinatorial) {
                                assert.isString(market.events[i].description);
                            }
                        }
                    }
                }
                if (done) done();
            };
            var params = {
                branch: branchId,
                offset: 0,
                numMarketsToLoad: 3
            };
            it("sync", function () {
                this.timeout(augur.constants.TIMEOUT);
                test(augur.getMarketsInfo(params), {numMarkets: params.numMarketsToLoad});
            });
            it("sync/missing numMarketsToLoad", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                test(augur.getMarketsInfo(p));
            });
            it("sync/missing numMarketsToLoad/missing offset", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                delete p.offset;
                test(augur.getMarketsInfo(p));
            });
            it("sync/combinatorial", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                p.combinatorial = true;
                test(augur.getMarketsInfo(p), {
                    numMarkets: params.numMarketsToLoad,
                    combinatorial: true
                });
            });
            it("async", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                params.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, {numMarkets: params.numMarketsToLoad}, done);
                };
                augur.getMarketsInfo(params);
            });
            it("async/missing numMarketsToLoad", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                };
                augur.getMarketsInfo(p);
            });
            it("async/missing numMarketsToLoad/missing offset", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                delete p.offset;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                };
                augur.getMarketsInfo(p);
            });
            it("async/offset=1/numMarketsToLoad=2", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var numMarketsToLoad = 3;
                augur.getMarketsInfo({
                    branch: branchId,
                    offset: 1,
                    numMarketsToLoad: numMarketsToLoad,
                    callback: function (info) {
                        if (info.error) return done(info);
                        assert.strictEqual(Object.keys(info).length, numMarketsToLoad);
                        test(info, {numMarkets: numMarketsToLoad}, done);
                    }
                });
            });
            it("async/combinatorial", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                p.combinatorial = true;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, {
                        numMarkets: params.numMarketsToLoad,
                        combinatorial: true
                    }, done);
                };
                augur.getMarketsInfo(p);
            });
        });

        describe("price history", function () {

            var test = function (record, priceType) {
                assert.isObject(record);
                assert.property(record, "year");
                assert.isNumber(record.year);
                assert.isAbove(record.year, 2014);
                assert.property(record, "month");
                assert.isNumber(record.month);
                assert(record.month > 0 && record.month < 13);
                assert.property(record, "day");
                assert.isNumber(record.day);
                assert(record.day > 0 && record.day < 32);
                assert.property(record, "timestamp");
                assert.isNumber(record.timestamp);
                assert.isAbove(record.timestamp, 0);
                assert.property(record, priceType);
                assert.isNumber(record[priceType]);
                assert.property(record, "volume");
                assert.isNumber(record.volume);
                assert.isAbove(record.volume, 0);
            };

            var callback = function (prices, priceType, done) {
                for (var outcome in prices) {
                    if (!prices.hasOwnProperty(outcome)) continue;
                    assert.isArray(prices[outcome]);
                    if (!prices[outcome].length) continue;
                    for (var i = 0, len = prices[outcome].length; i < len; ++i) {
                        test(prices[outcome][i], priceType);
                    }
                }
                done();
            };

            if (!process.env.CONTINUOUS_INTEGRATION) {
                before(function (done) {
                    this.timeout(augur.constants.TIMEOUT);
                    augur.trade({
                        branch: branchId,
                        market: marketId,
                        outcome: "2",
                        amount: "2.01",
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
                            done();
                        },
                        onFailed: done
                    });
                });
            }

            it("getPrices(" + marketId + ")", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getPrices(marketId, function (prices) {
                    callback(prices, "price", done);
                });
            });

            it("getClosingPrices(" + marketId + ")", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                augur.getClosingPrices(marketId, function (prices) {
                    callback(prices, "closingPrice", done);
                });
            });
        });
    });
}
