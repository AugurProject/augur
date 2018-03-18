"use strict";

var BigNumber = require("bignumber.js");

function calculateTotalFill(onChainShares, attoTokens, onChainFillPrice) {
  if (onChainShares.constructor !== BigNumber) onChainShares = new BigNumber(onChainShares, 10);
  if (attoTokens.constructor !== BigNumber) attoTokens = new BigNumber(attoTokens, 10);
  if (onChainFillPrice.constructor !== BigNumber) onChainFillPrice = new BigNumber(onChainFillPrice, 10);
  return onChainShares.plus(attoTokens.dividedBy(onChainFillPrice));
}

module.exports = calculateTotalFill;
