"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeBidOrder(numShares, price, minPrice, outcome, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcome < 0 || outcome >= numOutcomes) throw new Error("Invalid outcome ID");
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.lt(minPrice)) throw new Error("Price is below the minimum price");
  var gasFees = ZERO;
  var sharePriceLong = price.minus(minPrice);
  var tokensEscrowed = ZERO;
  var sharesEscrowed = new BigNumber(2, 10).toPower(254);
  for (var i = 0; i < numOutcomes; ++i) {
    if (i !== outcome) {
      sharesEscrowed = BigNumber.min(shareBalances[i], sharesEscrowed);
    }
  }
  sharesEscrowed = BigNumber.min(sharesEscrowed, numShares);
  if (sharesEscrowed.gt(ZERO)) {
    numShares = numShares.minus(sharesEscrowed);
    for (i = 0; i < numOutcomes; ++i) {
      if (i !== outcome) {
        shareBalances[i] = shareBalances[i].minus(sharesEscrowed);
      }
    }
  }
  if (numShares.gt(ZERO)) tokensEscrowed = numShares.times(sharePriceLong);
  return {
    gasFees: gasFees,
    otherSharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed,
    shareBalances: shareBalances
  };
}

module.exports = simulateMakeBidOrder;
