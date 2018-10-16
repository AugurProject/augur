"use strict";

function convertDisplayPriceToOnChainPrice(displayPrice, minDisplayPrice, tickSize) {
  return displayPrice.minus(minDisplayPrice).dividedBy(tickSize);
}

module.exports = convertDisplayPriceToOnChainPrice;
