#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var tools = require("../tools");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

describe("calculatePriceDepth", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var liquidity = new BigNumber(t.liquidity);
            var startingQuantity = new BigNumber(t.startingQuantity);
            var bestStartingQuantity = new BigNumber(t.bestStartingQuantity);
            var halfPriceWidth = new BigNumber(t.halfPriceWidth);
            var minValue = new BigNumber(t.minValue);
            var maxValue = new BigNumber(t.maxValue);
            var priceDepth = augur.calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue);
            assert.strictEqual(priceDepth.toFixed(), t.expected);
        });
    };
    test({
        liquidity: 100,
        startingQuantity: 5,
        bestStartingQuantity: 10,
        halfPriceWidth: "0.4",
        minValue: 0,
        maxValue: 1,
        expected: "0.0375"
    });
    test({
        liquidity: 500,
        startingQuantity: 5,
        bestStartingQuantity: 10,
        halfPriceWidth: "0.4",
        minValue: 0,
        maxValue: 1,
        expected: "0.00625"
    });
    test({
        liquidity: 50,
        startingQuantity: 5,
        bestStartingQuantity: 10,
        halfPriceWidth: "0.4",
        minValue: 0,
        maxValue: 1,
        expected: "0.1"
    });
    test({
        liquidity: 20,
        startingQuantity: 5,
        bestStartingQuantity: 10,
        halfPriceWidth: "0.4",
        minValue: 0,
        maxValue: 1,
        expected: "Infinity"
    });
});


if (process.env.AUGURJS_INTEGRATION_TESTS) {

    describe("generateOrderBook", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT*10);
                augur.createSingleEventMarket({
                    branchId: augur.branches.dev,
                    description: "This is a test market.",
                    expDate: parseInt(new Date().getTime() / 250),
                    minValue: 1,
                    maxValue: 2,
                    numOutcomes: 2,
                    tradingFee: "0.03",
                    makerFees: "0.5",
                    tags: ["tests", "augur.js", "eyesores"],
                    extraInfo: "Test markets are really terrific!  I wish there were more of them on this site!",
                    resolution: "augur.js",
                    onSent: function (r) {},
                    onSuccess: function (r) {
                        augur.generateOrderBook({
                            market: r.marketID,
                            liquidity: t.liquidity,
                            initialFairPrices: t.initialFairPrices,
                            startingQuantity: t.startingQuantity,
                            bestStartingQuantity: t.bestStartingQuantity,
                            priceWidth: t.priceWidth,
                            isSimulation: true
                        }, {
                            onSimulate: function (simulation) {
                                assert.deepEqual(simulation, t.expected);
                                augur.generateOrderBook({
                                    market: r.marketID,
                                    liquidity: t.liquidity,
                                    initialFairPrices: t.initialFairPrices,
                                    startingQuantity: t.startingQuantity,
                                    bestStartingQuantity: t.bestStartingQuantity,
                                    priceWidth: t.priceWidth
                                }, {
                                    onBuyCompleteSets: function (res) {
                                        assert.strictEqual(res.callReturn, "1");
                                    },
                                    onSetupOutcome: function (res) {
                                        assert.strictEqual(res.market, r.marketID);
                                        assert(res.outcome);
                                    },
                                    onSetupOrder: function (res) {
                                        // console.log("onSetupOrder", res);
                                        assert.strictEqual(res.market, r.marketID);
                                        assert(res.outcome);
                                        assert(res.amount);
                                        assert(res.sellPrice || res.buyPrice);
                                    },
                                    onSuccess: function (res) {
                                        console.log("onSuccess", res);
                                        assert.isArray(res.buy);
                                        assert.isArray(res.sell);
                                        done();
                                    },
                                    onFailed: done
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
            liquidity: 50,
            initialFairPrices: ["0.4", "0.5"],
            startingQuantity: 5,
            bestStartingQuantity: 10,
            priceWidth: "0.4",
            expected: {
                shares: "25",
                numBuyOrders: [1, 2],
                numSellOrders: [3, 2],
                buyPrices: [
                    ["0.2"],
                    ["0.3", "0.16666666666666666667"]
                ],
                sellPrices: [
                    ["0.6", "0.73333333333333333333", "0.86666666666666666666"],
                    ["0.7", "0.83333333333333333333"]
                ],
                numTransactions: 14,
                priceDepth: "0.13333333333333333333"
            }
        });
    });

}
