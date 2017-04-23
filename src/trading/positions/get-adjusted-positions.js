"use strict";

var async = require("async");
var adjustPositions = require("./adjust-positions");
var calculateShareTotals = require("./calculate-share-totals");
var findUniqueMarketIDs = require("./find-unique-market-ids");
var getShortAskBuyCompleteSetsLogs = require("../../logs/get-short-ask-buy-complete-sets-logs");
var getTakerShortSellLogs = require("../../logs/get-taker-short-sell-logs");
var getSellCompleteSetsLogs = require("../../logs/get-sell-complete-sets-logs");
var isFunction = require("../../utils/is-function");

/**
 * @param {string} account Ethereum account address.
 * @param {Object=} options eth_getLogs parameters (optional).
 * @param {function=} callback Callback function (optional).
 * @return {Object} Adjusted positions keyed by marketID.
 */
function getAdjustedPositions(account, options, callback) {
  var shareTotals, marketIDs;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!isFunction(callback)) {
    shareTotals = calculateShareTotals({
      shortAskBuyCompleteSets: getShortAskBuyCompleteSetsLogs(account, options),
      shortSellBuyCompleteSets: getTakerShortSellLogs(account, options),
      sellCompleteSets: getSellCompleteSetsLogs(account, options)
    });
    marketIDs = options.market ? [options.market] : findUniqueMarketIDs(shareTotals);
    return adjustPositions(account, marketIDs, shareTotals);
  }
  async.parallel({
    shortAskBuyCompleteSets: function (done) {
      getShortAskBuyCompleteSetsLogs(account, options, done);
    },
    shortSellBuyCompleteSets: function (done) {
      getTakerShortSellLogs(account, options, done);
    },
    sellCompleteSets: function (done) {
      getSellCompleteSetsLogs(account, options, done);
    }
  }, function (err, logs) {
    var shareTotals, marketIDs;
    if (err) return callback(err);
    shareTotals = calculateShareTotals(logs);
    marketIDs = options.market ? [options.market] : findUniqueMarketIDs(shareTotals);
    adjustPositions(account, marketIDs, shareTotals, callback);
  });
},