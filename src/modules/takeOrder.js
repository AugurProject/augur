"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var async = require("async");
var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var splitOrder = require("./splitOrder");
var abacus = require("./abacus");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  placeBuy: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    if (!callback) callback = utils.noop;
    if (this.options.debug.trading) {
      console.log('placeBuy:', market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks.toString(), doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
    }
    tradeCommitLockCallback(true);
    var self = this;
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, 0, totalCost, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return callback(err);
      var sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
      if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
        if (self.options.debug.trading) {
          console.log("buy remainder:", sharesRemaining.toFixed(), "shares remaining,", res.remainingEth.toFixed(), "cash remaining", constants.PRECISION.limit.toFixed(), "precision limit");
        }
        if (!doNotMakeOrders) {
          self.placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice, tradeGroupID, callback);
        } else {
          callback(null);
        }
      }
    });
  },

  placeSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    if (!callback) callback = utils.noop;
    if (this.options.debug.trading) {
      console.log('placeSell:', market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks.toString(), doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
    }
    var self = this;
    tradeCommitLockCallback(true);
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, numShares, 0, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return callback(err);
      if (res.remainingShares.gt(constants.PRECISION.zero)) {
        self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
          var position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
          var remainingShares = abi.bignum(res.remainingShares);
          if (position.gt(constants.PRECISION.zero)) {
            if (!doNotMakeOrders) {
              var shares = splitOrder(remainingShares, position);
              var askShares = shares.askShares;
              var shortAskShares = shares.shortAskShares;
              var hasAskShares = abi.bignum(askShares).gt(constants.PRECISION.zero);
              var hasShortAskShares = abi.bignum(shortAskShares).gt(constants.PRECISION.zero);
              if (hasAskShares) self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID, callback);
              if (hasShortAskShares) self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID, callback);
              if (!hasAskShares && !hasShortAskShares) callback(null);
            } else {
              callback(null);
            }
          } else {
            var tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, getOrderBooks(), address);
            if (tradeIDs && tradeIDs.length) {
              self.placeShortSell(market, outcomeID, res.remainingShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback);
            } else if (!doNotMakeOrders) {
              self.placeShortAsk(market, outcomeID, res.remainingShares, limitPrice, tradeGroupID, callback);
            } else {
              callback(null);
            }
          }
        });
      } else {
        callback(null);
      }
    });
  },

  placeShortSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    if (!callback) callback = utils.noop;
    if (this.options.debug.trading) {
      console.log('placeShortSell:', market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, getOrderBooks.toString(), doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
    }
    var self = this;
    tradeCommitLockCallback(true);
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeShortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return callback(err);
      if (res.remainingShares.gt(constants.PRECISION.zero) && !doNotMakeOrders) {
        self.placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice, tradeGroupID, callback);
      } else {
        callback(null);
      }
    });
  }

};
