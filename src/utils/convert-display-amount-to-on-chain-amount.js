"use strict";

var speedomatic = require("speedomatic");

function convertDisplayAmountToOnChainAmount(displayAmount, displayRange, numTicks) {
  var tickSize = displayRange.dividedBy(numTicks);
  return speedomatic.fix(displayAmount).times(tickSize);
}

module.exports = convertDisplayAmountToOnChainAmount;
