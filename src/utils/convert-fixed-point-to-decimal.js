"use strict";

var BigNumber = require("bignumber.js");

/**
 * @param {string|number} decimalValue
 * @param {string|number} conversionFactor
 * @return {string}
 */
function convertFixedPointToDecimal(fixedPointValue, conversionFactor) {
  return new BigNumber(fixedPointValue, 10).dividedBy(new BigNumber(conversionFactor, 10)).toFixed();
}

module.exports = convertFixedPointToDecimal;
