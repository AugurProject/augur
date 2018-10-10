"use strict";

var simulateCreateAskOrder = require("./simulate-create-ask-order");
var simulateFillBidOrder = require("./simulate-fill-bid-order");
var sumSimulatedResults = require("./sum-simulated-results");
var filterAndSortByPrice = require("../filter-and-sort-by-price");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateSell(outcome, sharesToCover, shareBalances, tokenBalance, minPrice, maxPrice, price, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, buyOrderBook) {
  var simulatedSell = {
    sharesFilled: ZERO,
    settlementFees: ZERO,
    worstCaseFees: ZERO,
    sharesDepleted: ZERO,
    otherSharesDepleted: ZERO,
    tokensDepleted: ZERO,
    shareBalances: shareBalances,
  };
  var matchingSortedBids = filterAndSortByPrice({ singleOutcomeOrderBookSide: buyOrderBook, orderType: 1, price: price });

  // if no matching bids, then user is asking: no settlement fees
  if (!matchingSortedBids.length && price !== null) {
    simulatedSell = sumSimulatedResults(simulatedSell, simulateCreateAskOrder(sharesToCover, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, shareBalances));

  // if there are matching bids, user is selling
  } else {
    var simulatedFillBidOrder = simulateFillBidOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedBids, outcome, shareBalances);
    simulatedSell = sumSimulatedResults(simulatedSell, simulatedFillBidOrder);
    if (simulatedFillBidOrder.sharesToCover.gt(PRECISION.zero) && price !== null) {
      simulatedSell = sumSimulatedResults(simulatedSell, simulateCreateAskOrder(simulatedFillBidOrder.sharesToCover, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, simulatedFillBidOrder.shareBalances));
    }
  }

  return simulatedSell;
}

module.exports = simulateSell;
