"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var convertDecimalToFixedPoint = require("../utils/convert-decimal-to-fixed-point");

/** Type definition for TradeCost.
 * @typedef {Object} TradeCost
 * @property {string} cost Wei (attoether) value needed for this trade, as a hexadecimal string.
 * @property {string} amountNumTicksRepresentation Number of shares to trade in on-chain (numTicks) representation, as a hexadecimal string.
 * @property {string} priceNumTicksRepresentation Limit price in on-chain (numTicks) representation, as a hexadecimal string.
 */

/**
 * @param {Object} p Parameters object.
 * @param {string} p.price Normalized limit price for this trade, as a base-10 string.
 * @param {string} p.amount Number of shares to trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market, as a base-10 string.
 * @param {string} p.tickSize The tick size (interval) for this market, as a base-10 string.
 * @param {number} p.orderType Order type (0 for "buy", 1 for "sell").
 * @return {TradeCost} Cost breakdown of this trade.
 */
function calculateTradeCost(p) {
  var priceNumTicksRepresentation = convertDecimalToFixedPoint(p.price, p.numTicks);
  var adjustedPrice = p.orderType === 0 ? new BigNumber(priceNumTicksRepresentation, 16) : new BigNumber(p.numTicks, 10).minus(new BigNumber(priceNumTicksRepresentation, 16));
  var amountNumTicksRepresentation = convertDecimalToFixedPoint(p.amount, speedomatic.fix(p.tickSize, "string"));
  return {
    cost: "0x" + new BigNumber(amountNumTicksRepresentation, 16).times(adjustedPrice).toString(16),
    amountNumTicksRepresentation: amountNumTicksRepresentation,
    priceNumTicksRepresentation: priceNumTicksRepresentation,
  };
}

module.exports = calculateTradeCost;
