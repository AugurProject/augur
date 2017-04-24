"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

function sumTrades(trade_ids) {
  var i, numTrades, trades = new BigNumber(0);
  for (i = 0, numTrades = trade_ids.length; i < numTrades; ++i) {
    trades = abi.wrap(trades.plus(abi.bignum(trade_ids[i], null, true)));
  }
  return abi.hex(trades, true);
}

module.exports = sumTrades;
