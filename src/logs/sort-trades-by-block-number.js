"use strict";

function sortByBlockNumber(a, b) {
  return a.blockNumber - b.blockNumber;
}

function sortTradesByBlockNumber(trades) {
  var marketTrades, outcomeTrades, outcomeIDs, numOutcomes, marketIDs, numMarkets, i, j;
  marketIDs = Object.keys(trades);
  numMarkets = marketIDs.length;
  for (i = 0; i < numMarkets; ++i) {
    marketTrades = trades[marketIDs[i]];
    outcomeIDs = Object.keys(marketTrades);
    numOutcomes = outcomeIDs.length;
    for (j = 0; j < numOutcomes; ++j) {
      outcomeTrades = marketTrades[outcomeIDs[j]];
      outcomeTrades = outcomeTrades.sort(sortByBlockNumber);
    }
  }
  return trades;
}

module.exports = sortTradesByBlockNumber;
