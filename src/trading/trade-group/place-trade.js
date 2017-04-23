"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var calculateBuyTradeIDs = require("./take-order/calculate-buy-trade-ids");
var calculateSellTradeIDs = require("./take-order/calculate-sell-trade-ids");
var placeBuy = require("./take-order/place-buy");
var placeSell = require("./take-order/place-sell");
var placeShortSell = require("./take-order/place-short-sell");
var splitOrder = require("./take-order/split-order");
var placeBid = require("./make-order/place-bid");
var placeAsk = require("./make-order/place-ask");
var placeShortAsk = require("./make-order/place-short-ask");
var placeAskAndShortAsk = require("./make-order/place-ask-and-short-ask");
var api = require("../api");
var PRECISION = require("../constants").PRECISION;

// market: {id, type, minValue (for scalars)}
function placeTrade(market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
  var tradeIDs, marketID = market.id;
  if (tradeType === "buy") {
    tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
    if (tradeIDs && tradeIDs.length) {
      placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
    } else if (!doNotMakeOrders) {
      placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID, callback);
    } else {
      callback(null);
    }
  } else if (tradeType === "sell") {

    // check if user has position
    //  - if so, sell/ask
    //  - if not, short sell/short ask
    api.Markets.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
      var position, tradeIDs, shares, askShares, shortAskShares, hasAskShares, hasShortAskShares;
      if (!sharesPurchased || sharesPurchased.error) return callback(sharesPurchased);
      position = abi.bignum(sharesPurchased).round(PRECISION.decimals, BigNumber.ROUND_DOWN);
      tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
      if (position && position.gt(PRECISION.zero)) {
        if (tradeIDs && tradeIDs.length) {
          placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
        } else if (!doNotMakeOrders) {
          shares = splitOrder(abi.bignum(numShares), position);
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
      } else if (tradeIDs && tradeIDs.length) {
        placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
      } else if (!doNotMakeOrders) {
        placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID, callback);
      } else {
        callback(null);
      }
    });
  }
}

module.exports = placeTrade;
