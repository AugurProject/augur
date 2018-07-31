"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;
var calculateSettlementFee = require("./calculate-settlement-fee");

function simulateCreateAskOrder(numShares, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcome < 0 || outcome >= numOutcomes) throw new Error("Invalid outcome ID");
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.gt(maxPrice)) throw new Error("Price is above the maximum price");
  var worstCaseFees = ZERO;
  var tokensEscrowed = ZERO;
  var sharesEscrowed = ZERO;
  var sharePriceLong = price.minus(minPrice);
  if (shareBalances[outcome].gt(ZERO)) {
    sharesEscrowed = BigNumber.min(shareBalances[outcome], numShares);
    numShares = numShares.minus(sharesEscrowed);
    shareBalances[outcome] = shareBalances[outcome].minus(sharesEscrowed);
  }
  if (numShares.gt(ZERO)) tokensEscrowed = numShares.times(maxPrice.minus(price));
  if (sharesEscrowed.gt(ZERO)) worstCaseFees = calculateSettlementFee(sharesEscrowed, marketCreatorFeeRate, maxPrice.minus(minPrice), shouldCollectReportingFees, reportingFeeRate, sharePriceLong);
  return {
    worstCaseFees: worstCaseFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed,
    shareBalances: shareBalances,
  };
}

module.exports = simulateCreateAskOrder;
