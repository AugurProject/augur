"use strict";

function calculateAskCost(onChainPrice, onChainAmount, numTicks) {
  return numTicks.minus(onChainPrice).times(onChainAmount);
}

module.exports = calculateAskCost;
