"use strict";

var calculateShareTotals = require("./calculate-share-totals");
var calculateCompleteSetsEffectivePrice = require("./calculate-complete-sets-effective-price");
var calculateShortSellBuyCompleteSetsEffectivePrice = require("./calculate-short-sell-buy-complete-sets-effective-price");
var findUniqueMarketIDs = require("./find-unique-market-ids");

/**
 * Calculates aggregate trade from buy/sell complete sets.
 *
 * @param {Array} logs Event logs from eth_getLogs request.
 * @return Object Aggregate trades keyed by market ID.
 */
function calculateNetEffectiveTrades(logs) {
  var shareTotals, effectivePrices, netEffectiveTrades, marketIDs, numMarketIDs, i, marketID, shareTotal, effectivePrice, completeSetsTypes, numCompleteSetsTypes, completeSetsType, j;
  shareTotals = calculateShareTotals({
    shortAskBuyCompleteSets: logs.shortAskBuyCompleteSets,
    shortSellBuyCompleteSets: logs.shortSellBuyCompleteSets,
    sellCompleteSets: logs.sellCompleteSets
  });
  effectivePrices = {
    shortAskBuyCompleteSets: calculateCompleteSetsEffectivePrice(logs.shortAskBuyCompleteSets),
    shortSellBuyCompleteSets: calculateShortSellBuyCompleteSetsEffectivePrice(logs.shortSellBuyCompleteSets),
    sellCompleteSets: calculateCompleteSetsEffectivePrice(logs.sellCompleteSets)
  };
  netEffectiveTrades = {};
  marketIDs = findUniqueMarketIDs(effectivePrices);
  numMarketIDs = marketIDs.length;
  for (i = 0; i < numMarketIDs; ++i) {
    marketID = marketIDs[i];
    if (!netEffectiveTrades[marketID]) netEffectiveTrades[marketID] = {};
    completeSetsTypes = Object.keys(effectivePrices);
    numCompleteSetsTypes = completeSetsTypes.length;
    for (j = 0; j < numCompleteSetsTypes; ++j) {
      completeSetsType = completeSetsTypes[j];
      shareTotal = shareTotals[completeSetsType][marketID];
      effectivePrice = effectivePrices[completeSetsType][marketID];
      if (shareTotal && effectivePrice) {
        netEffectiveTrades[marketID][completeSetsType] = {
          type: completeSetsType === "sellCompleteSets" ? "sell" : "buy",
          price: effectivePrice,
          shares: shareTotal.abs()
        };
      }
    }
  }
  return netEffectiveTrades;
}

module.exports = calculateNetEffectiveTrades;
