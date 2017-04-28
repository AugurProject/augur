"use strict";

var BigNumber = require("bignumber.js");

// expects BigNumber inputs
function calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue) {
  return startingQuantity.times(
    minValue.plus(maxValue).minus(halfPriceWidth)
  ).dividedBy(
    liquidity.minus(new BigNumber(2, 10).times(bestStartingQuantity))
  );
}

module.exports = calculatePriceDepth;
