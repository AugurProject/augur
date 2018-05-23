"use strict";

var BigNumber = require("bignumber.js");
var calculateTickSize = require("../trading/calculate-tick-size");
var convertDisplayPriceToOnChainPrice = require("./convert-display-price-to-on-chain-price");
var convertOnChainPriceToDisplayPrice = require("./convert-on-chain-price-to-display-price");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.displayPrice Display price for this trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {string} p.maxDisplayPrice The maximum display price for this market, as a base-10 string.
 * @param {string} p.minDisplayPrice The minimum display price for this market, as a base-10 string.
 * @return {BigNumber} Display price adjusted for numTicks.
 */
function convertDisplayPriceToAdjustedForNumTicksDisplayPrice(p) {
  var numTicks = new BigNumber(p.numTicks, 10);
  var minPrice = new BigNumber(p.minPrice, 10);
  var maxPrice = new BigNumber(p.maxPrice, 10);
  var displayPrice = new BigNumber(p.displayPrice, 10);
  var tickSize = calculateTickSize(numTicks, minPrice, maxPrice);
  var onChainPrice = convertDisplayPriceToOnChainPrice(displayPrice, minPrice, tickSize).integerValue(BigNumber.ROUND_FLOOR);
  return convertOnChainPriceToDisplayPrice(onChainPrice, minPrice, tickSize);
}

module.exports = convertDisplayPriceToAdjustedForNumTicksDisplayPrice;
