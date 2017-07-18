"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeAskOrder(numShares, price, maxPrice, sharesHeld) {
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.gt(maxPrice)) throw new Error("Price is above the maximum price");
  var gasFees = ZERO;
  var tokensEscrowed = ZERO;
  var sharesEscrowed = ZERO;
  var numShares = numShares;
  if (sharesHeld.gt(PRECISION.zero)) {
    sharesEscrowed = BigNumber.min(sharesHeld, numShares);
    numShares = numShares.minus(sharesEscrowed);
  }
  if (numShares.gt(PRECISION.zero)) tokensEscrowed = numShares.times(maxPrice.minus(price));
  return {
    gasFees: gasFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed
  };
}

module.exports = simulateMakeAskOrder;
