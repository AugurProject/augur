"use strict";

var BigNumber = require("bignumber.js");

function calculateTotalFill(onChainShares, attoTokens, onChainFillPrice) {
  if (!BigNumber.isBigNumber(onChainShares)) onChainShares = new BigNumber(onChainShares, 10);
  if (!BigNumber.isBigNumber(attoTokens)) attoTokens = new BigNumber(attoTokens, 10);
  if (!BigNumber.isBigNumber(onChainFillPrice)) onChainFillPrice = new BigNumber(onChainFillPrice, 10);
  return onChainShares.plus(attoTokens.dividedBy(onChainFillPrice).integerValue(BigNumber.ROUND_DOWN));
}

module.exports = calculateTotalFill;
