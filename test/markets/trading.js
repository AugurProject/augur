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

var marketInfo = {
    network: '7',
    traderCount: 0,
    alpha: '0.00790000000000000001',
    traderIndex: 0,
    numOutcomes: 2,
    tradingPeriod: 430,
    tradingFee: '0.01999999999999999998',
    branchId: '0xf69b5',
    numEvents: 1,
    cumulativeScale: '1',
    creationFee: '5',
    author: '0x638546ec58f50525399c347721f73560c38d240b',
    type: 'binary',
    endDate: 774406,
    participants: {},
    winningOutcomes: [ '0', '0', '0', '0', '0', '0', '0', '0' ],
    description: 'aaaaa',
    outcomes: 
    [ { shares: {},
       id: 1,
       outstandingShares: '4.93722535442561653607',
       price: '0.6024732828486665092' },
     { shares: {},
       id: 2,
       outstandingShares: '4.93722535442561653607',
       price: '0.6024732828486665092' } ],
    events: 
    [ { id: '-0x1aecfbd70a48916566f6f7ab535a2fdc454cd440c497b29691be2cf3112f5afe',
       endDate: 774406,
       outcome: '0',
       minValue: '1',
       maxValue: '2',
       numOutcomes: 2,
       type: 'binary' } ],
    price: '0.6024732828486665092',
    _id: '-0xcf8a981f275566bbe85f08c6657bd96867e45efe69d3356a363b01244e38042f'
};

if (!process.env.CONTINUOUS_INTEGRATION) {

    beforeEach(function () {
        // augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    var amount = 1;
    var outcome = 2;

    it("lsLmsr", function () {
        var cost = augur.lsLmsr(marketInfo);
        assert.strictEqual(parseFloat(cost).toFixed(6), "0.788992");
    });

    it("price", function () {
        var price = augur.price(marketInfo, outcome);
        assert.strictEqual(parseFloat(price).toFixed(6), "0.070319")
    });

    it("getSimulatedBuy", function () {
        var simulatedBuy = augur.getSimulatedBuy(marketInfo, outcome, amount);
        assert.isArray(simulatedBuy);
        assert.strictEqual(simulatedBuy.length, 2);
        assert.strictEqual(parseFloat(simulatedBuy[0]).toFixed(8), "0.00000316");
        assert.strictEqual(parseFloat(simulatedBuy[1]).toFixed(8), "0.07031896");
    });

    it("getSimulatedSell", function () {
        var simulatedSell = augur.getSimulatedSell(marketInfo, outcome, amount);
        assert.isArray(simulatedSell);
        assert.strictEqual(simulatedSell.length, 2);
        assert.strictEqual(parseFloat(simulatedSell[0]).toFixed(8), "-0.00000316");
        assert.strictEqual(parseFloat(simulatedSell[1]).toFixed(8), "0.07031896");
    });

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
                                amount: amount,
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
                                        amount: amount,
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
