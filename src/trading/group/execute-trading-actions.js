"use strict";

var abi = require("augur-abi");
var async = require("async");
var generateTradeGroupID = require("./generate-trade-group-id");
var placeTrade = require("./place-trade");
var noop = require("../../utils/noop");

function executeTradingActions(market, outcomeID, address, getOrderBooks, doNotMakeOrders, tradesInProgress, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
  var tradeGroupID;
  if (!tradeCommitmentCallback) tradeCommitmentCallback = noop;
  if (!tradeCommitLockCallback) tradeCommitLockCallback = noop;
  if (!callback) callback = noop;
  tradeGroupID = generateTradeGroupID();
  async.eachSeries(tradesInProgress, function (tradeInProgress, nextTradeInProgress) {
    if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
      return nextTradeInProgress();
    }
    placeTrade(
      market,
      outcomeID,
      tradeInProgress.side,
      tradeInProgress.numShares,
      tradeInProgress.limitPrice,
      tradeInProgress.tradingFeesEth,
      address,
      abi.bignum(tradeInProgress.totalCost).abs().toFixed(),
      getOrderBooks,
      doNotMakeOrders,
      tradeGroupID,
      tradeCommitmentCallback,
      tradeCommitLockCallback,
      nextTradeInProgress
    );
  }, function (err) {
    if (err) return callback(err);
    callback(null, tradeGroupID);
  });
  return tradeGroupID;
}

module.exports = executeTradingActions;
