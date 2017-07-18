"use strict";

var BigNumber = require("bignumber.js");
var simulateBuy = require("./simulate-buy");
var simulateSell = require("./simulate-sell");

/**
 * Allows to estimate what trading methods will be called based on user's order.
 * This is useful so users know how much they pay for trading.
 * { type, outcomeID, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, shouldCollectReportingFees, marketOrderBook }
 * @return { settlementFees, gasFees, sharesDepleted, otherSharesDepleted, tokensDepleted, shareBalances }
 */
function simulateTrade(p) {
  var outcomeID = parseInt(p.outcomeID, 10);
  var sharesToCover = new BigNumber(p.shares, 10);
  var price = new BigNumber(p.price, 10);
  var minPrice = new BigNumber(p.minPrice, 10);
  var maxPrice = new BigNumber(p.maxPrice, 10);
  var marketCreatorFeeRate = new BigNumber(p.marketCreatorFeeRate, 10);
  var reportingFeeRate = new BigNumber(p.reportingFeeRate, 10);
  var shareBalances = p.shareBalances.map(function (shareBalance) { return new BigNumber(shareBalance, 10); });
  var simulatedTrade = (p.type === "buy") ?
    simulateBuy(outcomeID, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, p.shouldCollectReportingFees, marketOrderBook.sell) :
    simulateSell(outcomeID, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, p.shouldCollectReportingFees, marketOrderBook.buy);
  return {
    settlementFees: simulatedTrade.settlementFees.toFixed(),
    gasFees: simulatedTrade.gasFees.toFixed(),
    sharesDepleted: simulatedTrade.sharesDepleted.toFixed(),
    otherSharesDepleted: simulatedTrade.otherSharesDepleted.toFixed(),
    tokensDepleted: simulatedTrade.tokensDepleted.toFixed(),
    shareBalances: simulatedTrade.shareBalances.map(function (shareBalance) { return shareBalance.toFixed(); })
  };
}

module.exports = simulateTrade;
