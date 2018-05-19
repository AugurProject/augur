"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");

function convertDisplayAmountToOnChainAmount(displayAmount, displayRange, numTicks) {
  if (numTicks.eq(10002) || numTicks.eq(10003)) {
    numTicks = new BigNumber(10000, 10);
  }
  var tickSize = displayRange.dividedBy(numTicks);
  return speedomatic.fix(displayAmount).times(tickSize);
}

module.exports = convertDisplayAmountToOnChainAmount;
