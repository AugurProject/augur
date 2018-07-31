"use strict";

var BigNumber = require("bignumber.js");

function calculateTickSize(numTicks, minPrice, maxPrice) {
  if (!BigNumber.isBigNumber(numTicks)) numTicks = new BigNumber(numTicks, 10);
  if (!BigNumber.isBigNumber(minPrice)) minPrice = new BigNumber(minPrice, 10);
  if (!BigNumber.isBigNumber(maxPrice)) maxPrice = new BigNumber(maxPrice, 10);
  return maxPrice.minus(minPrice).dividedBy(numTicks);
}

module.exports = calculateTickSize;
