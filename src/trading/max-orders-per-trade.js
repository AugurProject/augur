"use strict";

var TRADE_GAS = require("../constants").TRADE_GAS;

var MINIMUM_GAS_LIMIT = 3135000;

// type: "buy" or "sell"
// gasLimit (optional): block gas limit as an integer
function maxOrdersPerTrade(type, gasLimit) {
  return 1 + ((gasLimit || MINIMUM_GAS_LIMIT) - TRADE_GAS[0][type]) / TRADE_GAS[1][type] >> 0;
}

module.exports = maxOrdersPerTrade;
