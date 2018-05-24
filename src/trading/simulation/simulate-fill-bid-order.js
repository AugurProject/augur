"use strict";

var BigNumber = require("bignumber.js");
var calculateSettlementFee = require("./calculate-settlement-fee");
var modifyOtherShareBalances = require("./modify-other-share-balances");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateFillBidOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedBids, outcome, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcome < 0 || outcome >= numOutcomes) throw new Error("Invalid outcome ID");
  if (sharesToCover.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  var settlementFees = ZERO;
  var makerSharesDepleted = ZERO;
  var makerTokensDepleted = ZERO;
  var takerSharesDepleted = ZERO;
  var takerTokensDepleted = ZERO;
  var takerOtherSharesGainedByDepletingTokens = ZERO;
  var sharesFilled = ZERO;
  matchingSortedBids.forEach(function (matchingBid) {
    var takerDesiredSharesForThisOrder = BigNumber.min(new BigNumber(matchingBid.amount, 10), sharesToCover);
    var orderDisplayPrice = new BigNumber(matchingBid.fullPrecisionPrice, 10);
    var sharePriceShort = maxPrice.minus(orderDisplayPrice);
    var sharePriceLong = orderDisplayPrice.minus(minPrice);
    var makerSharesEscrowed = BigNumber.min(new BigNumber(matchingBid.sharesEscrowed, 10), sharesToCover);
    sharesToCover = sharesToCover.minus(takerDesiredSharesForThisOrder);
    var takerSharesAvailable = BigNumber.min(takerDesiredSharesForThisOrder, shareBalances[outcome].minus(takerSharesDepleted));
    sharesFilled = sharesFilled.plus(takerDesiredSharesForThisOrder);

    // maker is closing a short, taker is closing a long: complete sets sold
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerSharesAvailable.gt(PRECISION.zero)) {
      var completeSets = BigNumber.min(makerSharesEscrowed, takerSharesAvailable);
      settlementFees = settlementFees.plus(calculateSettlementFee(completeSets, marketCreatorFeeRate, maxPrice.minus(minPrice), shouldCollectReportingFees, reportingFeeRate, sharePriceLong));
      makerSharesDepleted = makerSharesDepleted.plus(completeSets);
      takerSharesDepleted = takerSharesDepleted.plus(completeSets);
      takerSharesAvailable = takerSharesAvailable.minus(completeSets);
      makerSharesEscrowed = makerSharesEscrowed.minus(completeSets);
      takerDesiredSharesForThisOrder = takerDesiredSharesForThisOrder.minus(completeSets);
    }

    // maker is closing a short, taker is opening a short
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerDesiredSharesForThisOrder.gt(PRECISION.zero)) {
      var tokensRequiredToCoverTaker = makerSharesEscrowed.times(sharePriceShort);
      makerSharesDepleted = makerSharesDepleted.plus(makerSharesEscrowed);
      takerTokensDepleted = takerTokensDepleted.plus(tokensRequiredToCoverTaker);
      takerOtherSharesGainedByDepletingTokens = takerOtherSharesGainedByDepletingTokens.plus(makerSharesEscrowed);
      takerDesiredSharesForThisOrder = takerDesiredSharesForThisOrder.minus(makerSharesEscrowed);
      makerSharesEscrowed = ZERO;
    }

    // maker is opening a long, taker is closing a long
    if (takerSharesAvailable.gt(PRECISION.zero) && takerDesiredSharesForThisOrder.gt(PRECISION.zero)) {
      var tokensRequiredToCoverMaker = takerSharesAvailable.times(sharePriceLong);
      makerTokensDepleted = makerTokensDepleted.plus(tokensRequiredToCoverMaker);
      takerSharesDepleted = takerSharesDepleted.plus(takerSharesAvailable);
      takerDesiredSharesForThisOrder = takerDesiredSharesForThisOrder.minus(takerSharesAvailable);
      takerSharesAvailable = ZERO;
    }

    // maker is opening a long, taker is opening a short
    if (takerDesiredSharesForThisOrder.gt(PRECISION.zero)) {
      var takerPortionOfCompleteSetCost = takerDesiredSharesForThisOrder.times(sharePriceShort);
      var makerPortionOfCompleteSetCost = takerDesiredSharesForThisOrder.times(sharePriceLong);
      makerTokensDepleted = makerTokensDepleted.plus(makerPortionOfCompleteSetCost);
      takerTokensDepleted = takerTokensDepleted.plus(takerPortionOfCompleteSetCost);
      takerOtherSharesGainedByDepletingTokens = takerOtherSharesGainedByDepletingTokens.plus(takerDesiredSharesForThisOrder);
      takerDesiredSharesForThisOrder = ZERO;
    }
  });
  if (takerSharesDepleted.gt(ZERO)) {
    shareBalances[outcome] = shareBalances[outcome].minus(takerSharesDepleted);
  }
  if (takerOtherSharesGainedByDepletingTokens.gt(ZERO)) {
    shareBalances = modifyOtherShareBalances(outcome, takerOtherSharesGainedByDepletingTokens, shareBalances, true);
  }
  return {
    sharesFilled: sharesFilled,
    sharesToCover: sharesToCover,
    settlementFees: settlementFees,
    worstCaseFees: settlementFees,
    sharesDepleted: takerSharesDepleted,
    tokensDepleted: takerTokensDepleted,
    shareBalances: shareBalances,
  };
}

module.exports = simulateFillBidOrder;
