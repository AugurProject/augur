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

if (!process.env.CONTINUOUS_INTEGRATION) {

    beforeEach(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    var AMOUNT = 1;

    it("Look up / sanity check most recent market ID", function (done) {
        augur.getMarkets(augur.branches.dev, function (markets) {
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
            it(label, function (done) {
                this.timeout(augur.constants.TIMEOUT*2);
                var branch = augur.branches.dev;
                augur.getMarkets(branch, function (markets) {
                    markets.reverse();
                    async.eachSeries(markets, function (market, nextMarket) {
                        augur.getMarketEvents(market, function (events) {
                            async.eachSeries(events, function (thisEvent, nextEvent) {
                                augur.getNumOutcomes(thisEvent, function (numOutcomes) {
                                    numOutcomes = parseInt(numOutcomes);
                                    if (numOutcomes !== t.numOutcomes) {
                                        return nextEvent();
                                    }
                                    augur.getMaxValue(thisEvent, function (maxValue) {
                                        maxValue = abi.number(maxValue);
                                        if (t.scalar && maxValue === 1) {
                                            return nextEvent();
                                        }
                                        if (!t.scalar && t.numOutcomes === 2 && maxValue !== 1) {
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
                            augur.buyShares({
                                branchId: branch,
                                marketId: found.market,
                                outcome: outcome,
                                amount: AMOUNT,
                                nonce: null,
                                onSent: function (r) {
                                    // console.log("buyShares sent:", r);
                                    assert.isObject(r);
                                    assert.isNotNull(r.callReturn);
                                    assert.isNotNull(r.txHash);
                                    assert.isAbove(abi.number(r.callReturn), 0);
                                },
                                onSuccess: function (r) {
                                    // console.log("buyShares success:", r);
                                    assert.isObject(r);
                                    assert.isNotNull(r.callReturn);
                                    assert.isString(r.txHash);
                                    assert.isString(r.blockHash);
                                    assert.isNotNull(r.blockNumber);
                                    assert.isAbove(abi.number(r.blockNumber), 0);
                                    assert.isAbove(abi.number(r.callReturn), 0);
                                    augur.sellShares({
                                        branchId: branch,
                                        marketId: found.market,
                                        outcome: outcome,
                                        amount: AMOUNT,
                                        nonce: null,
                                        onSent: function (r) {
                                            // console.log("sellShares sent:", r);
                                            assert.isObject(r);
                                            assert.isNotNull(r.callReturn);
                                            assert.isNotNull(r.txHash);
                                            assert.isAbove(abi.number(r.callReturn), 0);
                                        },
                                        onSuccess: function (r) {
                                            // console.log("sellShares success:", r);
                                            assert.isObject(r);
                                            assert.isNotNull(r.callReturn);
                                            assert.isString(r.txHash);
                                            assert.isString(r.blockHash);
                                            assert.isNotNull(r.blockNumber);
                                            assert.isAbove(abi.number(r.blockNumber), 0);
                                            assert.isAbove(abi.number(r.callReturn), 0);
                                            done();
                                        },
                                        onFailed: done
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
    });
}
