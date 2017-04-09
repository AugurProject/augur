"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");
var splitOrder = require("./splitOrder");
var noop = require("../utils/noop");
var constants = require("../constants");

module.exports = {

  generateTradeGroupID: function () {
    return abi.format_int256(Buffer.from(uuidParse.parse(uuid.v4())).toString("hex"));
  },

  executeTradingActions: function (market, outcomeID, address, getOrderBooks, doNotMakeOrders, tradesInProgress, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    var tradeGroupID, self = this;
    if (!tradeCommitmentCallback) tradeCommitmentCallback = noop;
    if (!tradeCommitLockCallback) tradeCommitLockCallback = noop;
    if (!callback) callback = noop;
    tradeGroupID = this.generateTradeGroupID();
    async.eachSeries(tradesInProgress, function (tradeInProgress, nextTradeInProgress) {
      if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
        return nextTradeInProgress();
      }
      if (self.options.debug.trading) console.log("placing trade:", tradeInProgress);
      self.placeTrade(
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
  },

  // market: {id, type, minValue (for scalars)}
  placeTrade: function (market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    var marketID, tradeIDs, self = this;
    marketID = market.id;
    if (tradeType === "buy") {
      tradeIDs = this.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
      if (tradeIDs && tradeIDs.length) {
        this.placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
      } else if (!doNotMakeOrders) {
        this.placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID, callback);
      } else {
        callback(null);
      }
    } else if (tradeType === "sell") {

      // check if user has position
      //  - if so, sell/ask
      //  - if not, short sell/short ask
      this.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        var position, tradeIDs, shares, askShares, shortAskShares, hasAskShares, hasShortAskShares;
        if (!sharesPurchased || sharesPurchased.error) return callback(sharesPurchased);
        position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
        tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
        if (position && position.gt(constants.PRECISION.zero)) {
          if (tradeIDs && tradeIDs.length) {
            self.placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
          } else if (!doNotMakeOrders) {
            shares = splitOrder(abi.bignum(numShares), position);
            askShares = shares.askShares;
            shortAskShares = shares.shortAskShares;
            hasAskShares = abi.bignum(askShares).gt(constants.PRECISION.zero);
            hasShortAskShares = abi.bignum(shortAskShares).gt(constants.PRECISION.zero);
            if (hasAskShares && hasShortAskShares) {
              self.placeAskAndShortAsk(market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback);
            } else if (hasAskShares) {
              self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID, callback);
            } else if (hasShortAskShares) {
              self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback);
            } else {
              callback(null);
            }
          } else {
            callback(null);
          }
        } else if (tradeIDs && tradeIDs.length) {
          self.placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
        } else if (!doNotMakeOrders) {
          self.placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID, callback);
        } else {
          callback(null);
        }
      });
    }
  }

};
