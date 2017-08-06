"use strict";

var filterByPriceAndOutcomeAndUserSortByPrice = require("./filter-by-price-and-outcome-and-user-sort-by-price");
var simulateMakeBidOrder = require("./simulate-make-bid-order");
var simulateTakeAskOrder = require("./simulate-take-ask-order");
var sumSimulatedResults = require("./sum-simulated-results");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateBuy(outcomeID, sharesToCover, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, sellOrderBook) {
  var simulatedBuy = {
    settlementFees: ZERO,
    gasFees: ZERO,
    sharesDepleted: ZERO,
    otherSharesDepleted: ZERO,
    tokensDepleted: ZERO,
    shareBalances: shareBalances
  };
  var matchingSortedAsks = filterByPriceAndOutcomeAndUserSortByPrice(sellOrderBook, "buy", price, outcomeID, userAddress);

  // if no matching asks, then user is bidding: no settlement fees
  if (!matchingSortedAsks.length) {
    simulatedBuy = sumSimulatedResults(simulatedBuy, simulateMakeBidOrder(sharesToCover, price, minPrice, outcomeID, shareBalances));

  // if there are matching asks, user is buying
  } else {
    var simulatedTakeAskOrder = simulateTakeAskOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedAsks, outcomeID, shareBalances);
    simulatedBuy = sumSimulatedResults(simulatedBuy, simulatedTakeAskOrder);
    if (simulatedTakeAskOrder.sharesToCover.gt(PRECISION.zero)) {
      simulatedBuy = sumSimulatedResults(simulatedBuy, simulateMakeBidOrder(simulatedTakeAskOrder.sharesToCover, price, minPrice, outcomeID, shareBalances));
    }
  }

  return simulatedBuy;
}

module.exports = simulateBuy;
