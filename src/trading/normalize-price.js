"use strict";

var BigNumber = require("bignumber.js");

// normalizedPrice = (displayPrice - minValue)/(maxValue - minValue)
// Inputs are BigNumbers or base10 (JS numbers or strings).
function normalizePrice(minValue, maxValue, displayPrice) {
  if (minValue.constructor !== BigNumber) minValue = new BigNumber(minValue, 10);
  if (maxValue.constructor !== BigNumber) maxValue = new BigNumber(maxValue, 10);
  if (displayPrice.constructor !== BigNumber) displayPrice = new BigNumber(displayPrice, 10);
  if (minValue.gt(maxValue)) throw new Error("Minimum value larger than maximum value");
  if (displayPrice.lt(minValue)) throw new Error("Price is below the minimum value");
  if (displayPrice.gt(maxValue)) throw new Error("Price is above the maximum value");
  return displayPrice.minus(minValue).dividedBy(maxValue.minus(minValue)).toFixed();
}

module.exports = normalizePrice;
