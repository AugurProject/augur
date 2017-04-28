"use strict";

var async = require("async");
var adjustPositions = require("./adjust-positions");
var calculateShareTotals = require("./calculate-share-totals");
var findUniqueMarketIDs = require("./find-unique-market-ids");
var getShortAskBuyCompleteSetsLogs = require("../../logs/get-short-ask-buy-complete-sets-logs");
var getTakerShortSellLogs = require("../../logs/get-taker-short-sell-logs");
var getSellCompleteSetsLogs = require("../../logs/get-sell-complete-sets-logs");

/**
 * @param {string} account Ethereum account address.
 * @param {Object=} filter eth_getLogs parameters (optional).
 * @param {function=} callback Callback function (optional).
 * @return {Object} Adjusted positions keyed by marketID.
 */
// { account, filter }
function getAdjustedPositions(p, callback) {
  p.filter = p.filter || {};
  async.parallel({
    shortAskBuyCompleteSets: function (done) {
      getShortAskBuyCompleteSetsLogs(p, done);
    },
    shortSellBuyCompleteSets: function (done) {
      getTakerShortSellLogs(p, done);
    },
    sellCompleteSets: function (done) {
      getSellCompleteSetsLogs(p, done);
    }
  }, function (err, logs) {
    var shareTotals, marketIDs;
    if (err) return callback(err);
    shareTotals = calculateShareTotals(logs);
    marketIDs = p.filter.market ? [p.filter.market] : findUniqueMarketIDs(shareTotals);
    adjustPositions(p.account, marketIDs, shareTotals, callback);
  });
}

module.exports = getAdjustedPositions;
