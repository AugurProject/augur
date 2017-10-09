"use strict";

var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");
var denormalizePrice = require("../trading/denormalize-price");
var roundToPrecision = require("../utils/round-to-precision");
var constants = require("../constants");

/**
 * @param {number} orderType Order type (0 for "buy", 1 for "sell").
 * @param {string} minPrice This market's minimum possible price, as a base-10 string.
 * @param {string} maxPrice This market's maximum possible price, as a base-10 string.
 * @param {string[]} order Raw order info received from the contract, as an array of base-10 strings.
 * @return {require("../trading/get-open-orders").Order} Parsed order object.
 */
module.exports = function (orderType, minPrice, maxPrice, order) {
  if (!Array.isArray(order) || !order.length || !parseInt(order[0], 16)) return null;

  // 1: buy, 2: sell
  var round, roundingMode;
  if (parseInt(orderType, 10) === 1) {
    round = "floor";
    roundingMode = BigNumber.ROUND_DOWN;
  } else {
    round = "ceil";
    roundingMode = BigNumber.ROUND_UP;
  }

  var fullPrecisionAmount = speedomatic.unfix(order[0]);
  var amount = roundToPrecision(fullPrecisionAmount, constants.MINIMUM_TRADE_SIZE);
  if (amount === null) return null;

  var fullPrecisionPrice = denormalizePrice({ minPrice: minPrice, maxPrice: maxPrice, normalizedPrice: speedomatic.unfixSigned(order[1]) });
  var price = roundToPrecision(new BigNumber(fullPrecisionPrice, 10), constants.PRECISION.zero, round, roundingMode);
  if (price === null) return null;

  return {
    amount: amount,
    fullPrecisionAmount: fullPrecisionAmount.toFixed(),
    price: price,
    fullPrecisionPrice: fullPrecisionPrice,
    owner: speedomatic.formatEthereumAddress(order[2]),
    tokensEscrowed: speedomatic.unfix(order[3], "string"),
    sharesEscrowed: speedomatic.unfix(order[4], "string"),
    betterOrderId: speedomatic.formatInt256(order[5]),
    worseOrderId: speedomatic.formatInt256(order[6]),
    gasPrice: speedomatic.encodeNumberAsBase10String(order[7])
  };
};
