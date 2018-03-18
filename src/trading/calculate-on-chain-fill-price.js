"use strict";

var BigNumber = require("bignumber.js");

function calculateOnChainFillPrice(orderType, onChainPrice, numTicks) {
  if (onChainPrice.constructor !== BigNumber) onChainPrice = new BigNumber(onChainPrice, 10);
  if (orderType === 0) return onChainPrice;
  if (numTicks.constructor !== BigNumber) numTicks = new BigNumber(numTicks, 10);
  return numTicks.minus(onChainPrice);
}

module.exports = calculateOnChainFillPrice;
