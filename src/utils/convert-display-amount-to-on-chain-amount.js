"use strict";

var speedomatic = require("speedomatic");

function convertDisplayAmountToOnChainAmount(displayAmount, tickSize) {
  return speedomatic.fix(displayAmount).times(tickSize);
}

module.exports = convertDisplayAmountToOnChainAmount;
