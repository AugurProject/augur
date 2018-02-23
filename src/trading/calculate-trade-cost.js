"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var convertDecimalToFixedPoint = require("../utils/convert-decimal-to-fixed-point");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.price Normalized limit price for this trade, as a base-10 string.
 * @param {string} p.amount Number of shares to trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {string} p.tickSize The tick size (interval) for this market.
 * @param {number} p.orderType Order type (0 for "buy", 1 for "sell").
 */
function calculateTradeCost(p) {
  var priceNumTicksRepresentation = convertDecimalToFixedPoint(p.price, p.numTicks);
  var adjustedPrice = p.orderType === 0 ? new BigNumber(priceNumTicksRepresentation, 16) : new BigNumber(p.numTicks, 10).minus(new BigNumber(priceNumTicksRepresentation, 16));
  var onChainAmount = convertDecimalToFixedPoint(p.amount, speedomatic.fix(p.tickSize, "string"));
  return {
    cost: speedomatic.unfix(new BigNumber(onChainAmount, 16).times(adjustedPrice)).toFixed(),
    onChainAmount: onChainAmount,
    priceNumTicksRepresentation: priceNumTicksRepresentation,
  };
}

module.exports = calculateTradeCost;
