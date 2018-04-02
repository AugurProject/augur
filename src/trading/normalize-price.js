"use strict";

var BigNumber = require("bignumber.js");

/**
 * Rescale a price to lie on [0, 1]: normalizedPrice = (price - minPrice) / (maxPrice - minPrice)
 * @param {Object} p Parameters object.
 * @param {BigNumber|string} p.minPrice This market's minimum possible price, as a BigNumber or base-10 string.
 * @param {BigNumber|string} p.maxPrice This market's maximum possible price, as a BigNumber or base-10 string.
 * @param {BigNumber|string} p.price The price to be normalized, as a BigNumber or base-10 string.
 * @return {string} Price rescaled to [0, 1], as a base-10 string.
 */
function normalizePrice(p) {
  var minPrice = p.minPrice;
  var maxPrice = p.maxPrice;
  var price = p.price;
  if (!BigNumber.isBigNumber(minPrice)) minPrice = new BigNumber(minPrice, 10);
  if (!BigNumber.isBigNumber(maxPrice)) maxPrice = new BigNumber(maxPrice, 10);
  if (!BigNumber.isBigNumber(price)) price = new BigNumber(price, 10);
  if (minPrice.gt(maxPrice)) throw new Error("Minimum value larger than maximum value");
  if (price.lt(minPrice)) throw new Error("Price is below the minimum value");
  if (price.gt(maxPrice)) throw new Error("Price is above the maximum value");
  return price.minus(minPrice).dividedBy(maxPrice.minus(minPrice)).toFixed();
}

module.exports = normalizePrice;
