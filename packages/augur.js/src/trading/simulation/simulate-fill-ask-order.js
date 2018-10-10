"use strict";

var BigNumber = require("bignumber.js");
var calculateNearlyCompleteSets = require("./calculate-nearly-complete-sets");
var calculateSettlementFee = require("./calculate-settlement-fee");
var modifyOtherShareBalances = require("./modify-other-share-balances");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateFillAskOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedAsks, outcome, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcome < 0 || outcome >= numOutcomes) throw new Error("Invalid outcome ID");
  if (sharesToCover.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  var settlementFees = ZERO;
  var makerSharesDepleted = ZERO;
  var makerTokensDepleted = ZERO;
  var takerSharesDepleted = ZERO;
  var takerTokensDepleted = ZERO;
  var takerSharesGainedByDepletingTokens = ZERO;
  var sharesFilled = ZERO;
  matchingSortedAsks.forEach(function (matchingAsk) {
    var takerDesiredShares = BigNumber.min(new BigNumber(matchingAsk.amount, 10), sharesToCover);
    var makerSharesEscrowed = BigNumber.min(new BigNumber(matchingAsk.sharesEscrowed, 10), sharesToCover);
    var orderDisplayPrice = new BigNumber(matchingAsk.fullPrecisionPrice, 10);
    var sharePriceShort = maxPrice.minus(orderDisplayPrice);
    var sharePriceLong = orderDisplayPrice.minus(minPrice);
    var takerSharesAvailable = calculateNearlyCompleteSets(outcome, takerDesiredShares, shareBalances);
    sharesToCover = sharesToCover.minus(takerDesiredShares);
    sharesFilled = sharesFilled.plus(takerDesiredShares);

    // complete sets sold if maker is closing a long, taker is closing a short
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerSharesAvailable.gt(PRECISION.zero)) {
      var completeSets = BigNumber.min(makerSharesEscrowed, takerSharesAvailable);
      settlementFees = settlementFees.plus(calculateSettlementFee(completeSets, marketCreatorFeeRate, maxPrice.minus(minPrice), shouldCollectReportingFees, reportingFeeRate, sharePriceShort));
      makerSharesDepleted = makerSharesDepleted.plus(completeSets);
      takerSharesDepleted = takerSharesDepleted.plus(completeSets);
      takerDesiredShares = takerDesiredShares.minus(completeSets);
      makerSharesEscrowed = makerSharesEscrowed.minus(completeSets);
    }

    // maker is closing a long, taker is opening a long: no complete sets sold
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerDesiredShares.gt(PRECISION.zero)) {
      var tokensRequiredToCoverTaker = makerSharesEscrowed.times(sharePriceLong);
      makerSharesDepleted = makerSharesDepleted.plus(makerSharesEscrowed);
      takerTokensDepleted = takerTokensDepleted.plus(tokensRequiredToCoverTaker);
      takerSharesGainedByDepletingTokens = takerSharesGainedByDepletingTokens.plus(makerSharesEscrowed);
      takerDesiredShares = takerDesiredShares.minus(makerSharesEscrowed);
      makerSharesEscrowed = ZERO;
    }

    // maker is opening a short, taker is closing a short
    if (takerSharesAvailable.gt(PRECISION.zero) && takerDesiredShares.gt(PRECISION.zero)) {
      var tokensRequiredToCoverMaker = takerSharesAvailable.times(sharePriceShort);
      makerTokensDepleted = makerTokensDepleted.plus(tokensRequiredToCoverMaker);
      takerSharesDepleted = takerSharesDepleted.plus(takerSharesAvailable);
      takerDesiredShares = takerDesiredShares.minus(takerSharesAvailable);
      takerSharesAvailable = ZERO;
    }

    // maker is opening a short, taker is opening a long
    if (takerDesiredShares.gt(PRECISION.zero)) {
      var takerPortionOfCompleteSetCost = takerDesiredShares.times(sharePriceLong);
      var makerPortionOfCompleteSetCost = takerDesiredShares.times(sharePriceShort);
      makerTokensDepleted = makerTokensDepleted.plus(makerPortionOfCompleteSetCost);
      takerTokensDepleted = takerTokensDepleted.plus(takerPortionOfCompleteSetCost);
      takerSharesGainedByDepletingTokens = takerSharesGainedByDepletingTokens.plus(takerDesiredShares);
      takerDesiredShares = ZERO;
    }
  });
  if (takerSharesDepleted.gt(ZERO)) {
    shareBalances = modifyOtherShareBalances(outcome, takerSharesDepleted, shareBalances, false);
  }
  if (takerTokensDepleted.gt(ZERO)) {
    shareBalances[outcome] = shareBalances[outcome].plus(takerSharesGainedByDepletingTokens);
  }
  return {
    sharesFilled: sharesFilled,
    sharesToCover: sharesToCover,
    settlementFees: settlementFees,
    worstCaseFees: settlementFees,
    otherSharesDepleted: takerSharesDepleted,
    tokensDepleted: takerTokensDepleted,
    shareBalances: shareBalances,
  };
}

module.exports = simulateFillAskOrder;
