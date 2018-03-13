"use strict";

var speedomatic = require("speedomatic");

function convertOnChainAmountToDisplayAmount(onChainAmount, tickSize) {
  return speedomatic.unfix(onChainAmount.dividedBy(tickSize));
}

module.exports = convertOnChainAmountToDisplayAmount;
