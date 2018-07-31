"use strict";

function calculateBidCost(onChainPrice, onChainAmount) {
  return onChainPrice.times(onChainAmount);
}

module.exports = calculateBidCost;
