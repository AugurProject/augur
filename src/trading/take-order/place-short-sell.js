"use strict";

var calculateSellTradeIDs = require("./calculate-sell-trade-ids");
var executeShortSell = require("./execute-short-sell");
var placeShortAsk = require("../make-order/place-short-ask");
var noop = require("../../utils/noop");
var PRECISION = require("../../constants").PRECISION;

function placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
  var marketID, getTradeIDs;
  if (!callback) callback = noop;
  tradeCommitLockCallback(true);
  marketID = market.id;
  getTradeIDs = function (orderBooks) {
    return calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
  };
  executeShortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
    tradeCommitLockCallback(false);
    if (err) return callback(err);
    if (res.remainingShares.gt(PRECISION.zero) && !doNotMakeOrders) {
      placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice, tradeGroupID, callback);
    } else {
      callback(null);
    }
  });
}

module.exports = placeShortSell;
