"use strict";

var BigNumber = require("bignumber.js");

// displayPrice = normalizedPrice*(maxValue - minValue) + minValue
// Inputs are BigNumbers or base10 (JS numbers or strings).
function denormalizePrice(minValue, maxValue, normalizedPrice) {
  if (minValue.constructor !== BigNumber) minValue = new BigNumber(minValue, 10);
  if (maxValue.constructor !== BigNumber) maxValue = new BigNumber(maxValue, 10);
  if (normalizedPrice.constructor !== BigNumber) normalizedPrice = new BigNumber(normalizedPrice, 10);
  if (minValue.gt(maxValue)) throw new Error("Minimum value larger than maximum value");
  if (normalizedPrice.lt(0)) throw new Error("Normalized price is below 0");
  if (normalizedPrice.gt(1)) throw new Error("Normalized price is above 1");
  return normalizedPrice.times(maxValue.minus(minValue)).plus(minValue).toFixed();
}

module.exports = denormalizePrice;
