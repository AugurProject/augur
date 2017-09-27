"use strict";

var simulateMakeAskOrder = require("./simulate-make-ask-order");
var simulateTakeBidOrder = require("./simulate-take-bid-order");
var sumSimulatedResults = require("./sum-simulated-results");
var filterByPriceAndOutcomeAndUserSortByPrice = require("../order-book/filter-by-price-and-outcome-and-user-sort-by-price");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateSell(outcome, sharesToCover, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, buyOrderBook) {
  var simulatedSell = {
    settlementFees: ZERO,
    gasFees: ZERO,
    sharesDepleted: ZERO,
    otherSharesDepleted: ZERO,
    tokensDepleted: ZERO,
    shareBalances: shareBalances
  };
  var matchingSortedBids = filterByPriceAndOutcomeAndUserSortByPrice(buyOrderBook, 1, price, userAddress);

  // if no matching bids, then user is asking: no settlement fees
  if (!matchingSortedBids.length) {
    simulatedSell = sumSimulatedResults(simulatedSell, simulateMakeAskOrder(sharesToCover, price, maxPrice, outcome, shareBalances));

  // if there are matching bids, user is selling
  } else {
    var simulatedTakeBidOrder = simulateTakeBidOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedBids, outcome, shareBalances);
    simulatedSell = sumSimulatedResults(simulatedSell, simulatedTakeBidOrder);
    if (simulatedTakeBidOrder.sharesToCover.gt(PRECISION.zero)) {
      simulatedSell = sumSimulatedResults(simulatedSell, simulateMakeAskOrder(simulatedTakeBidOrder.sharesToCover, price, maxPrice, outcome, shareBalances));
    }
  }

  return simulatedSell;
}

module.exports = simulateSell;
