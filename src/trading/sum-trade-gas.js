"use strict";

var TRADE_GAS = require("../constants").TRADE_GAS;

// tradeTypes: array of "buy" and/or "sell"
function sumTradeGas(tradeTypes) {
  var i, n, gas = 0;
  for (i = 0, n = tradeTypes.length; i < n; ++i) {
    gas += TRADE_GAS[Number(Boolean(i))][tradeTypes[i]];
  }
  return gas;
}

module.exports = sumTradeGas;
