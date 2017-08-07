"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var denormalizePrice = require("../trading/denormalize-price");
var roundToPrecision = require("../utils/round-to-precision");
var constants = require("../constants");

module.exports = function (type, minPrice, maxPrice, order) {
  if (!Array.isArray(order) || !order.length) return null;

  // 1: buy, 2: sell
  var round, roundingMode;
  if (parseInt(type, 10) === 1) {
    round = "floor";
    roundingMode = BigNumber.ROUND_DOWN;
  } else {
    round = "ceil";
    roundingMode = BigNumber.ROUND_UP;
  }

  var fullPrecisionAmount = abi.unfix(order[0]);
  var amount = roundToPrecision(fullPrecisionAmount, constants.MINIMUM_TRADE_SIZE);
  if (amount === null) return null;

  var fullPrecisionPrice = denormalizePrice(minPrice, maxPrice, abi.unfix_signed(order[1]));
  var price = roundToPrecision(fullPrecisionPrice, constants.PRECISION.zero, round, roundingMode);
  if (price === null) return null;

  return {
    amount: amount,
    fullPrecisionAmount: fullPrecisionAmount.toFixed(),
    price: price,
    fullPrecisionPrice: fullPrecisionPrice.toFixed(),
    owner: abi.format_address(order[2]),
    tokensEscrowed: abi.unfix(order[3], "string"),
    sharesEscrowed: abi.unfix(order[4], "string"),
    betterOrderId: abi.format_int256(order[5]),
    worseOrderId: abi.format_int256(order[6]),
    gasPrice: abi.unfix(order[7], "string")
  };
};
