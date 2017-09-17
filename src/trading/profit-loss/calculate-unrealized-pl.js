"use strict";

var BigNumber = require("bignumber.js");
var ZERO = require("../../constants").ZERO;

// unrealized P/L: shares held * (last trade price - price on buy in)
function calculateUnrealizedPL(position, meanOpenPrice, lastTradePrice) {
  if (lastTradePrice.eq(ZERO)) return ZERO;
  return position.times(new BigNumber(lastTradePrice, 10).minus(meanOpenPrice));
}

module.exports = calculateUnrealizedPL;
