"use strict";

var unique = require("../../utils/unique");

/**
 * @param {Object} shareTotals Share totals keyed by log type.
 * @return {Array} marketIDs List of market IDs for position adjustment.
 */
function findUniqueMarketIDs(shareTotals) {
  return Object.keys(shareTotals.shortAskBuyCompleteSets)
    .concat(Object.keys(shareTotals.shortSellBuyCompleteSets))
    .concat(Object.keys(shareTotals.sellCompleteSets))
    .filter(unique);
}

module.exports = findUniqueMarketIDs;
