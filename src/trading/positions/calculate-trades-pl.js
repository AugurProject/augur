"use strict";

var calculateTradePL = require("./calculate-trade-pl");

function calculateTradesPL(PL, trades) {
  var i, numTrades = trades.length;
  if (numTrades) {
    for (i = 0; i < numTrades; ++i) {
      PL = calculateTradePL(PL, trades[i]);
    }
  }
  return PL;
}

module.exports = calculateTradesPL;
