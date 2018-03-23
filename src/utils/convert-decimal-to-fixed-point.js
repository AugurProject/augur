"use strict";

var BigNumber = require("bignumber.js");
var prefixHex = require("speedomatic").prefixHex;

/**
 * @param {string|number} decimalValue
 * @param {string|number} conversionFactor
 * @return {string}
 */
function convertDecimalToFixedPoint(decimalValue, conversionFactor) {
  return prefixHex(new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).integerValue(BigNumber.ROUND_FLOOR).toString(16));
}

module.exports = convertDecimalToFixedPoint;
