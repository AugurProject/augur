"use strict";

var BigNumber = require("bignumber.js");
var errors = require("../../rpc-interface").errors;
var ZERO = require("../../constants").ZERO;

function calculateOrderPrices(liquidity, startingQuantity, bestStartingQuantity, initialFairPrices, minValue, maxValue, halfPriceWidth) {
  var priceDepth, numOutcomes, buyPrices, sellPrices, numSellOrders, numBuyOrders, shares, i, j, buyPrice, sellPrice, outcomeShares;
  priceDepth = this.calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue);
  if (priceDepth.lte(ZERO) || priceDepth.toNumber() === Infinity) {
    return errors.INSUFFICIENT_LIQUIDITY;
  }
  numOutcomes = initialFairPrices.length;
  buyPrices = new Array(numOutcomes);
  sellPrices = new Array(numOutcomes);
  numSellOrders = new Array(numOutcomes);
  numBuyOrders = new Array(numOutcomes);
  shares = new BigNumber(0);
  for (i = 0; i < numOutcomes; ++i) {
    if (initialFairPrices[i].lt(minValue.plus(halfPriceWidth)) || initialFairPrices[i].gt(maxValue.minus(halfPriceWidth))) {
      return errors.INITIAL_PRICE_OUT_OF_BOUNDS;
    }
    if (initialFairPrices[i].plus(halfPriceWidth).gte(maxValue) || initialFairPrices[i].minus(halfPriceWidth).lte(minValue)) {
      return errors.PRICE_WIDTH_OUT_OF_BOUNDS;
    }
    buyPrice = initialFairPrices[i].minus(halfPriceWidth);
    sellPrice = initialFairPrices[i].plus(halfPriceWidth);
    numBuyOrders[i] = buyPrice.minus(minValue).dividedBy(priceDepth).floor().plus(1).toNumber();
    if (numBuyOrders[i] === 0) numBuyOrders[i] = 1;
    numSellOrders[i] = maxValue.minus(sellPrice).dividedBy(priceDepth).floor().plus(1);
    if (numSellOrders[i].eq(new BigNumber(0))) numSellOrders[i] = new BigNumber(1, 10);
    outcomeShares = bestStartingQuantity.plus(startingQuantity.times(numSellOrders[i]));
    if (outcomeShares.gt(shares)) shares = outcomeShares;
    numSellOrders[i] = numSellOrders[i].toNumber();
    buyPrices[i] = new Array(numBuyOrders[i]);
    buyPrices[i][0] = buyPrice;
    for (j = 1; j < numBuyOrders[i]; ++j) {
      buyPrices[i][j] = buyPrices[i][j - 1].minus(priceDepth);
      if (buyPrices[i][j].lte(minValue)) {
        buyPrices[i][j] = minValue.plus(priceDepth.dividedBy(new BigNumber(10, 10)));
      }
    }
    sellPrices[i] = new Array(numSellOrders[i]);
    sellPrices[i][0] = sellPrice;
    for (j = 1; j < numSellOrders[i]; ++j) {
      sellPrices[i][j] = sellPrices[i][j - 1].plus(priceDepth);
      if (sellPrices[i][j].gte(maxValue)) {
        sellPrices[i][j] = maxValue.minus(priceDepth.dividedBy(new BigNumber(10, 10)));
      }
    }
  }
  return {
    buyPrices: buyPrices,
    sellPrices: sellPrices,
    numSellOrders: numSellOrders,
    numBuyOrders: numBuyOrders,
    shares: shares
  };
}

module.exports = calculateOrderPrices;
