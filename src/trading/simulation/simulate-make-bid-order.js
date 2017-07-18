"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeBidOrder(numShares, price, minPrice, outcomeID, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcomeID <= 0 || outcomeID > numOutcomes) throw new Error("Invalid outcome ID");
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.lt(minPrice)) throw new Error("Price is below the minimum price");
  var gasFees = ZERO;
  var sharePriceLong = price.minus(minPrice);
  var tokensEscrowed = ZERO;
  var sharesEscrowed = new BigNumber(2, 10).toPower(254);
  for (var i = 1; i <= numOutcomes; ++i) {
    if (i !== outcomeID) {
      sharesEscrowed = BigNumber.min(shareBalances[i - 1], sharesEscrowed);
    }
  }
  sharesEscrowed = BigNumber.min(sharesEscrowed, numShares);
  if (sharesEscrowed.gt(ZERO)) {
    numShares = numShares.minus(sharesEscrowed);
    for (var i = 1; i <= numOutcomes; ++i) {
      if (i !== outcomeID) {
        shareBalances[i - 1] = shareBalances[i - 1].minus(sharesEscrowed);
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
