"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");

/** Type definition for TradeCost.
 * @typedef {Object} TradeCost
 * @property {string} cost Wei (attoether) value needed for this trade, as a hexadecimal string.
 * @property {string} onChainAmount Number of shares to trade in on-chain (numTicks) representation, as a hexadecimal string.

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
  console.log("calculating trade cost:", p);
  // var priceNumTicksRepresentation = convertDecimalToFixedPoint(p.price, p.numTicks);
  // console.log("priceNumTicksRepresentation:", priceNumTicksRepresentation, new BigNumber(priceNumTicksRepresentation, 16).toFixed());
  // var adjustedPrice = p.orderType === 0 ? new BigNumber(priceNumTicksRepresentation, 16) : new BigNumber(p.numTicks, 10).minus(new BigNumber(priceNumTicksRepresentation, 16));
  var adjustedPrice = p.orderType === 0 ? new BigNumber(p.price, 10) : new BigNumber(p.numTicks, 10).minus(new BigNumber(p.price, 10));
  console.log("adjustedPrice:", adjustedPrice.toFixed());
  var onChainAmount = new BigNumber(p.amount, 10).times(speedomatic.fix(p.tickSize));
  console.log("onChainAmount:", new BigNumber(onChainAmount, 16).toFixed());
  var cost = speedomatic.prefixHex(new BigNumber(onChainAmount, 16).times(adjustedPrice).floor().toString(16));
  console.log("cost:", cost, new BigNumber(cost, 16).toFixed());
  return {
    cost: cost,
    onChainAmount: speedomatic.prefixHex(onChainAmount.toString(16)),
    adjustedPrice: speedomatic.fix(adjustedPrice, "hex"),
    // priceNumTicksRepresentation: priceNumTicksRepresentation,
  };
}

module.exports = calculateTradeCost;
