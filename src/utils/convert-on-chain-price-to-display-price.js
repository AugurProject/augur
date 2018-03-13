"use strict";

function convertOnChainPriceToDisplayPrice(onChainPrice, minDisplayPrice, tickSize) {
  return onChainPrice.times(tickSize).plus(minDisplayPrice);
}

module.exports = convertOnChainPriceToDisplayPrice;
