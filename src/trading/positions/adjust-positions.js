"use strict";

var decreasePosition = require("./decrease-position");
var ZERO = require("../../constants").ZERO;

/**
 * Adjusts positions by subtracting out contributions from auto-generated
 * buyCompleteSets during shortAsk (or implicitly during short_sell).
 *
 * Standalone (non-delegated) buyCompleteSets are assumed to be part of
 * generateOrderBook, and are included in the user's position.
 *
 * sellCompleteSets - shortAskBuyCompleteSets
 *
 * Note: short_sell on-contract does not create a buyCompleteSets log.
 *
 * @param {string} account Ethereum account address.
 * @param {Array} marketIDs List of market IDs for position adjustment.
 * @param {Object} shareTotals Share totals keyed by log type.
 * @param {Object} onChainPositions On-chain (un-adjusted) positions, keyed by market ID.
 * @return {Object} Adjusted positions as base-10 strings, keyed by marketID.
 */
function adjustPositions(account, marketIDs, shareTotals, onChainPositions) {
  var adjustedPositions = {};
  marketIDs.forEach(function (marketID) {
    var onChainPosition = onChainPositions[marketID];
    var shortAskBuyCompleteSetsShareTotal = shareTotals.shortAskBuyCompleteSets[marketID] || ZERO;
    var shortSellBuyCompleteSetsShareTotal = shareTotals.shortSellBuyCompleteSets[marketID] || ZERO;
    var sellCompleteSetsShareTotal = shareTotals.sellCompleteSets[marketID] || ZERO;
    if (sellCompleteSetsShareTotal.abs().gt(shortAskBuyCompleteSetsShareTotal.plus(shortSellBuyCompleteSetsShareTotal))) {
      sellCompleteSetsShareTotal = shortAskBuyCompleteSetsShareTotal.plus(shortSellBuyCompleteSetsShareTotal).neg();
    }
    var sumCompleteSetsShareTotal = shortAskBuyCompleteSetsShareTotal.plus(shortSellBuyCompleteSetsShareTotal).plus(sellCompleteSetsShareTotal);
    adjustedPositions[marketID] = decreasePosition(onChainPosition, sumCompleteSetsShareTotal);
  });
  return adjustedPositions;
}

module.exports = adjustPositions;
