"use strict";

var calculateCompleteSetsShareTotals = require("./calculate-complete-sets-share-totals");
var calculateShortSellShareTotals = require("./calculate-short-sell-share-totals");

/**
 * @param {Object} logs Event logs from eth_getLogs request.
 * @return {Object} Share totals keyed by log type.
 */
function calculateShareTotals(logs) {
  return {
    shortAskBuyCompleteSets: calculateCompleteSetsShareTotals(logs.shortAskBuyCompleteSets),
    shortSellBuyCompleteSets: calculateShortSellShareTotals(logs.shortSellBuyCompleteSets),
    sellCompleteSets: calculateCompleteSetsShareTotals(logs.sellCompleteSets)
  };
}

module.exports = calculateShareTotals;
