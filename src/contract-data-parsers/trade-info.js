"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var constants = require("../constants");

module.exports = function (trade) {
  var type, round, roundingMode, fullPrecisionAmount, amount, fullPrecisionPrice, price;
  if (!trade || !trade.length || !parseInt(trade[0], 16)) return null;

  // 0x1=buy, 0x2=sell
  switch (trade[1]) {
    case "0x1":
      type = "buy";
      round = "floor";
      roundingMode = BigNumber.ROUND_DOWN;
      break;
    case "0x2":
      type = "sell";
      round = "ceil";
      roundingMode = BigNumber.ROUND_UP;
      break;
    default:
      return null;
  }

  fullPrecisionAmount = abi.unfix(trade[3]);
  amount = roundToPrecision(fullPrecisionAmount, constants.MINIMUM_TRADE_SIZE);
  if (amount === null) return null;

  fullPrecisionPrice = abi.unfix(abi.hex(trade[4], true));
  price = roundToPrecision(fullPrecisionPrice, constants.PRECISION.zero, round, roundingMode);
  if (price === null) return null;

  return {
    id: abi.format_int256(trade[0]),
    type: type,
    market: trade[2],
    amount: amount,
    fullPrecisionAmount: fullPrecisionAmount.toFixed(),
    price: price,
    fullPrecisionPrice: fullPrecisionPrice.toFixed(),
    owner: abi.format_address(trade[5]),
    block: parseInt(trade[6], 16),
    outcome: abi.string(trade[7])
  };
};
