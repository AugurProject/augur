"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeAskOrder(numShares, price, maxPrice, outcomeID, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcomeID <= 0 || outcomeID > numOutcomes) throw new Error("Invalid outcome ID");
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.gt(maxPrice)) throw new Error("Price is above the maximum price");
  var gasFees = ZERO;
  var tokensEscrowed = ZERO;
  var sharesEscrowed = ZERO;
  var numShares = numShares;
  if (shareBalances[outcomeID - 1].gt(ZERO)) {
    sharesEscrowed = BigNumber.min(shareBalances[outcomeID - 1], numShares);
    numShares = numShares.minus(sharesEscrowed);
    shareBalances[outcomeID - 1] = shareBalances[outcomeID - 1].minus(sharesEscrowed);
  }
  if (numShares.gt(ZERO)) tokensEscrowed = numShares.times(maxPrice.minus(price));
  return {
    gasFees: gasFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed,
    shareBalances: shareBalances
  };
}

module.exports = simulateMakeAskOrder;
