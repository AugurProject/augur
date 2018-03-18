"use strict";

var BigNumber = require("bignumber.js");

function calculateTickSize(numTicks, minPrice, maxPrice) {
  if (numTicks.constructor !== BigNumber) numTicks = new BigNumber(numTicks, 10);
  if (minPrice.constructor !== BigNumber) minPrice = new BigNumber(minPrice, 10);
  if (maxPrice.constructor !== BigNumber) maxPrice = new BigNumber(maxPrice, 10);
  return maxPrice.minus(minPrice).dividedBy(numTicks);
}

module.exports = calculateTickSize;
