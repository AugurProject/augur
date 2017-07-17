"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeBidOrder(sharesToCover, price, minPrice, shareBalances) {
  var gasFees = ZERO;
  // var orderValueInTokens = sharesToCover.times(price);
  // require(orderValueInTokens >= MIN_ORDER_VALUE)
  var sharePriceLong = price.minus(minPrice);
  var tokensEscrowed = ZERO;
  var sharesEscrowed = new BigNumber(2, 10).toPower(254);
  shareBalances.forEach(function (shareBalance) {
    sharesEscrowed = BigNumber.min(new BigNumber(shareBalance, 10), sharesEscrowed);
  });
  if (sharesEscrowed.gt(PRECISION.zero)) {
    sharesToCover = sharesToCover.minus(sharesEscrowed);
  }
  if (sharesToCover.gt(PRECISION.zero)) {
    tokensEscrowed = sharesToCover.times(sharePriceLong);
  }
  return {
    gasFees: gasFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed
  };
}

module.exports = simulateMakeBidOrder;
