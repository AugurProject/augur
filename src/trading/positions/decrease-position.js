
"use strict";

var BigNumber = require("bignumber.js");

/**
 * @param {string[]} position Starting position in a market.
 * @param {BigNumber} adjustment Amount to decrease all positions by.
 * @return {string[]} Decreased market position.
 */
function decreasePosition(position, adjustment) {
  return position.map(function (positionInOutcome) {
    return new BigNumber(positionInOutcome, 10).minus(adjustment).toFixed();
  });
}

module.exports = decreasePosition;
