
"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var tools = require("../tools");
// var augur = tools.setup(require("../../src"), process.argv.slice(2));
var augur = require('../../src');

describe("calculatePriceDepth", function () {
// 4 tests total
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
