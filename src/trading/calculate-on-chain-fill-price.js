"use strict";

var BigNumber = require("bignumber.js");

function calculateOnChainFillPrice(orderType, onChainPrice, numTicks) {
  if (!BigNumber.isBigNumber(onChainPrice)) onChainPrice = new BigNumber(onChainPrice, 10);
  if (orderType === 1) return onChainPrice;
  if (!BigNumber.isBigNumber(numTicks)) numTicks = new BigNumber(numTicks, 10);
  return numTicks.minus(onChainPrice);
}

module.exports = calculateOnChainFillPrice;
