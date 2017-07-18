"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeBidOrder(numShares, price, minPrice, shareBalances) {
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.lt(minPrice)) throw new Error("Price is below the minimum price");
  var gasFees = ZERO;
  var sharePriceLong = price.minus(minPrice);
  var tokensEscrowed = ZERO;
  var sharesEscrowed = new BigNumber(2, 10).toPower(254);
  shareBalances.forEach(function (shareBalance) {
    sharesEscrowed = BigNumber.min(new BigNumber(shareBalance, 10), sharesEscrowed);
  });
  sharesEscrowed = BigNumber.min(sharesEscrowed, numShares);
  if (sharesEscrowed.gt(PRECISION.zero)) numShares = numShares.minus(sharesEscrowed);
  if (numShares.gt(PRECISION.zero)) tokensEscrowed = numShares.times(sharePriceLong);
  return {
    gasFees: gasFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed
  };
}

module.exports = simulateMakeBidOrder;
