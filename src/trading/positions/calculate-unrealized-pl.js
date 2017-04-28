"use strict";

var abi = require("augur-abi");
var ZERO = require("../../constants").ZERO;

// unrealized P/L: shares held * (last trade price - price on buy in)
function calculateUnrealizedPL(position, meanOpenPrice, lastTradePrice) {
  if (lastTradePrice.eq(ZERO)) return ZERO;
  return position.times(abi.bignum(lastTradePrice).minus(meanOpenPrice));
}

module.exports = calculateUnrealizedPL;
