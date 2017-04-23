"use strict";

var abi = require("augur-abi");
var calculateBuyTradeIDs = require("./calculate-buy-trade-ids");
var placeBid = require("../make-order/place-bid");
var noop = require("../../utils/noop");
var PRECISION = require("../../constants").PRECISION;

function placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
  var marketID, getTradeIDs;
  if (!callback) callback = noop;
  tradeCommitLockCallback(true);
  marketID = market.id;
  getTradeIDs = function (orderBooks) {
    return calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
  };
  this.executeTrade(marketID, outcomeID, 0, totalCost, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
    var sharesRemaining;
    tradeCommitLockCallback(false);
    if (err) return callback(err);
    sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
    if (sharesRemaining.gte(PRECISION.limit) && res.remainingEth.gte(PRECISION.limit)) {
      if (!doNotMakeOrders) {
        placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice, tradeGroupID, callback);
      } else {
        callback(null);
      }
    }
  });
}

module.exports = placeBuy;
