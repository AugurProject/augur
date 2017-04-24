"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var calculateSellTradeIDs = require("./calculate-sell-trade-ids");
var executeTrade = require("./execute-trade");
var splitOrder = require("./split-order");
var placeShortSell = require("./place-short-sell");
var placeAsk = require("../make-order/place-ask");
var placeShortAsk = require("../make-order/place-short-ask");
var placeAskAndShortAsk = require("../make-order/place-ask-and-short-ask");
var api = require("../../api");
var noop = require("../../utils/noop");
var PRECISION = require("../../constants").PRECISION;

function placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
  var marketID, getTradeIDs;
  if (!callback) callback = noop;
  tradeCommitLockCallback(true);
  marketID = market.id;
  getTradeIDs = function (orderBooks) {
    return calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
  };
  executeTrade(marketID, outcomeID, numShares, 0, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
    tradeCommitLockCallback(false);
    if (err) return callback(err);
    if (res.remainingShares.gt(PRECISION.zero)) {
      api().Markets.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        var position, remainingShares, shares, askShares, shortAskShares, hasAskShares, hasShortAskShares, tradeIDs;
        position = abi.bignum(sharesPurchased).round(PRECISION.decimals, BigNumber.ROUND_DOWN);
        remainingShares = abi.bignum(res.remainingShares);
        if (position.gt(PRECISION.zero)) {
          if (!doNotMakeOrders) {
            shares = splitOrder(remainingShares, position);
            askShares = shares.askShares;
            shortAskShares = shares.shortAskShares;
            hasAskShares = abi.bignum(askShares).gt(PRECISION.zero);
            hasShortAskShares = abi.bignum(shortAskShares).gt(PRECISION.zero);
            if (hasAskShares && hasShortAskShares) {
              placeAskAndShortAsk(market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback);
            } else if (hasAskShares) {
              placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID, callback);
            } else if (hasShortAskShares) {
              placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback);
            } else {
              callback(null);
            }
          } else {
            callback(null);
          }
        } else {
          tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
          if (tradeIDs && tradeIDs.length) {
            placeShortSell(market, outcomeID, res.remainingShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
          } else if (!doNotMakeOrders) {
            placeShortAsk(market, outcomeID, res.remainingShares, limitPrice, tradeGroupID, callback);
          } else {
            callback(null);
          }
        }
      });
    } else {
      callback(null);
    }
  });
}

module.exports = placeSell;
