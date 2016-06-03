#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var tools = require("../tools");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

describe("generateOrderBook", function () {
    var test = function (t) {
        it(JSON.stringify(t), function (done) {
            augur.createSingleEventMarket({
                branchId: augur.branches.dev,
                description: "This is a test market",
                expDate: new Date().getTime() / 500,
                minValue: 1,
                maxValue: 2,
                numOutcomes: 2,
                tradingFee: "0.025",
                makerFees: "0.5",
                tags: ["tests", "augur.js", "eyesores"],
                extraInfo: "Test markets are really terrific!  I wish there were more of them on this site!",
                resolution: "augur.js",
                onSent: function (r) {},
                onSuccess: function (r) {
                    augur.generateOrderBook({
                        market: r.marketID,
                        liquidity: t.liquidity,
                        initialFairPrice: t.initialFairPrice,
                        startingQuantity: t.startingQuantity,
                        bestStartingQuantity: t.bestStartingQuantity,
                        priceWidth: t.priceWidth,
                        priceDepth: t.priceDepth
                    }, {
                        onBuyCompleteSets: function (res) {
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSetupOutcome: function (res) {
                            assert.strictEqual(res.market, r.marketID);
                            assert(res.outcome);
                        },
                        onSetupOrder: function (res) {
                            console.log("onSetupOrder", res);
                            assert.strictEqual(res.market, r.marketID);
                            assert(res.outcome);
                            assert(res.amount);
                            assert(res.sellPrice || res.buyPrice);
                        },
                        onSuccess: function (res) {
                            console.log("onSuccess", res);
                            assert.isArray(res.buy);
                            assert.isArray(res.sell);
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
        });
    };
    test({
        liquidity: 100,
        initialFairPrice: "0.4",
        startingQuantity: 5,
        bestStartingQuantity: 10,
        priceWidth: "0.4",
        priceDepth: "0.2"
    });
});
