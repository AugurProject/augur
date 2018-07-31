"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;
var calculateSettlementFee = require("./calculate-settlement-fee");

function simulateCreateBidOrder(numShares, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcome < 0 || outcome >= numOutcomes) throw new Error("Invalid outcome ID");
  if (numShares.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  if (price.lt(minPrice)) throw new Error("Price is below the minimum price");
  var worstCaseFees = ZERO;
  var sharePriceLong = price.minus(minPrice);
  var sharePriceShort = maxPrice.minus(price);
  var tokensEscrowed = ZERO;
  var sharesEscrowed = new BigNumber(2, 10).exponentiatedBy(254);
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

    worstCaseFees = calculateSettlementFee(sharesEscrowed, marketCreatorFeeRate, maxPrice.minus(minPrice), shouldCollectReportingFees, reportingFeeRate, sharePriceShort);
  }
  if (numShares.gt(ZERO)) tokensEscrowed = numShares.times(sharePriceLong);
  return {
    worstCaseFees: worstCaseFees,
    otherSharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed,
    shareBalances: shareBalances,
  };
}

module.exports = simulateCreateBidOrder;
