"use strict";

var abi = require("augur-abi");
var sumTrades = require("./sum-trades");
var sha3 = require("../../utils/sha3");

function makeTradeHash(max_value, max_amount, trade_ids) {
  return sha3([
    sumTrades(trade_ids),
    abi.fix(max_amount, "hex"),
    abi.fix(max_value, "hex")
  ]);
}

module.exports = makeTradeHash;
