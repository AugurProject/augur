"use strict";

var BigNumber = require("bignumber.js");
var filterByPriceAndOutcomeAndUserSortByPrice = require("./filter-by-price-and-outcome-and-user-sort-by-price");
var simulateMakeAskOrder = require("./simulate-make-ask-order");
var simulateMakeBidOrder = require("./simulate-make-bid-order");
var simulateTakeAskOrder = require("./simulate-take-ask-order");
var simulateTakeBidOrder = require("./simulate-take-bid-order");
var sumSimulatedResults = require("./sum-simulated-results");
var rpcInterface = require("../../rpc-interface");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

// marketCreatorFeeRate: market.getMarketCreatorSettlementFeeInAttoethPerEth()
// shouldCollectReportingFees: market.shouldCollectReportingFees()
// reportingFeeRate: MARKET_FEE_CALCULATOR.getReportingFeeInAttoethPerEth()
/**
 * Allows to estimate what trading methods will be called based on user's order.
 * This is useful so users know how much they pay for trading.
 * { outcomeID, numOutcomes, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, completeSetsValue, marketCreatorFeeRate, shouldCollectReportingFees, marketOrderBook }
 * @return { settlementFees, gasFees, sharesDepleted, tokensDepleted }
 */
function simulateTrade(p) {
  var outcomeID = parseInt(outcomeID, 10);
  var sharesToCover = new BigNumber(p.shares, 10);
  var price = new BigNumber(p.price, 10);
  var minPrice = new BigNumber(p.minPrice, 10);
  var maxPrice = new BigNumber(p.maxPrice, 10);
  var range = maxPrice.minus(minPrice);
  var completeSetsValue = new BigNumber(p.completeSetsValue, 10);
  var marketCreatorFeeRate = new BigNumber(p.marketCreatorFeeRate, 10);
  var reportingFeeRate = new BigNumber(p.reportingFeeRate, 10);
  var gasPrice = rpcInterface.getGasPrice();
  var simulatedTrade = {
    settlementFees: ZERO,
    gasFees: ZERO,
    sharesDepleted: ZERO,
    tokensDepleted: ZERO
  };
  // FIXME decrement shares in shareBalances object between actions

  if (type === "buy") {
    var matchingSortedAsks = filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.sell, type, orderLimitPrice, outcomeID, userAddress);

    // if no matching asks, then user is bidding: no settlement fees
    if (!matchingSortedAsks.length) {
      simulatedTrade = sumSimulatedResults(simulatedTrade, simulateMakeBidOrder(sharesToCover, price, minPrice, shareBalances));

    // if there are matching asks, user is buying
    } else {
      var simulatedTakeAskOrder = simulateTakeAskOrder(sharesToCover, minPrice, maxPrice, range, marketCreatorFeeRate, reportingFeeRate, p.shouldCollectReportingFees, matchingSortedAsks, shareBalances);
      simulatedTrade = sumSimulatedResults(simulatedTrade, simulatedTakeAskOrder);
      if (simulatedTakeAskOrder.sharesToCover.gt(PRECISION.zero)) {
        simulatedTrade = sumSimulatedResults(simulatedTrade, simulateMakeBidOrder(sharesToCover, price, minPrice, shareBalances));
      }
    }
  } else {
    var matchingSortedBids = filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.buy, type, orderLimitPrice, outcomeID, userAddress);

    // if no matching bids, then user is asking: no settlement fees
    if (!matchingSortedBids.length) {
      simulatedTrade = sumSimulatedResults(simulatedTrade, simulateMakeAskOrder(sharesToCover, price, maxPrice, new BigNumber(shareBalances[outcomeID - 1], 10)));

    // if there are matching bids, user is selling
    } else {
      var simulatedTakeBidOrder = simulateTakeBidOrder(sharesToCover, minPrice, maxPrice, range, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedBids, shareBalances);
      simulatedTrade = sumSimulatedResults(simulatedTrade, simulatedTakeBidOrder);
      if (simulatedTakeBidOrder.sharesToCover.gt(PRECISION.zero)) {
        simulatedTrade = sumSimulatedResults(simulatedTrade, simulateMakeAskOrder(sharesToCover, price, maxPrice, shareBalances));
      }
    }
  }

  return {
    settlementFees: simulatedTrade.settlementFees.toFixed(),
    gasFees: simulatedTrade.gasFees.toFixed(),
    sharesDepleted: simulatedTrade.takerSharesDepleted.toFixed(),
    tokensDepleted: simulatedTrade.takerTokensDepleted.toFixed()
  };
}

module.exports = simulateTrade;
