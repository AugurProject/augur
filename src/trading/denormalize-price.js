"use strict";

var BigNumber = require("bignumber.js");

/**
 * Rescale a price to its display range [minPrice, maxPrice]: displayPrice = normalizedPrice*(maxPrice - minPrice) + minPrice
 * @param {Object} p Parameters object.
 * @param {BigNumber|string} p.minPrice This market's minimum possible price, as a BigNumber or base-10 string.
 * @param {BigNumber|string} p.maxPrice This market's maximum possible price, as a BigNumber or base-10 string.
 * @param {BigNumber|string} p.normalizedPrice The price to be denormalized, as a BigNumber or base-10 string.
 * @return {string} Price rescaled to [minPrice, maxPrice], as a base-10 string.
 */
function denormalizePrice(p) {
  var minPrice = p.minPrice;
  var maxPrice = p.maxPrice;
  var normalizedPrice = p.normalizedPrice;
  if (!BigNumber.isBigNumber(minPrice)) minPrice = new BigNumber(minPrice, 10);
  if (!BigNumber.isBigNumber(maxPrice)) maxPrice = new BigNumber(maxPrice, 10);
  if (!BigNumber.isBigNumber(normalizedPrice)) normalizedPrice = new BigNumber(normalizedPrice, 10);
  if (minPrice.gt(maxPrice)) throw new Error("Minimum value larger than maximum value");
  if (normalizedPrice.lt(0)) throw new Error("Normalized price is below 0");
  if (normalizedPrice.gt(1)) throw new Error("Normalized price is above 1");
  return normalizedPrice.times(maxPrice.minus(minPrice)).plus(minPrice).toFixed();
}

module.exports = denormalizePrice;
