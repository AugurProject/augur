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

  placeBuy: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback) {
    tradeCommitLockCallback(true);
    var self = this;
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, 0, totalCost, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return console.error("trade failed:", err);
      var sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
      if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
        console.log("buy remainder:", sharesRemaining.toFixed(), "shares remaining,", res.remainingEth.toFixed(), "cash remaining", constants.PRECISION.limit.toFixed(), "precision limit");
        if (!doNotMakeOrders) {
          self.placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice, tradeGroupID);
        }
      }
    });
  },

  placeSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback) {
    var self = this;
    tradeCommitLockCallback(true);
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, numShares, 0, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return console.error("trade failed:", err);
      if (res.remainingShares.gt(constants.PRECISION.zero)) {
        self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
          var position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
          var remainingShares = abi.bignum(res.remainingShares);
          if (position.gt(constants.PRECISION.zero)) {
            if (!doNotMakeOrders) {
              var shares = splitOrder(remainingShares, position);
              var askShares = shares.askShares;
              var shortAskShares = shares.shortAskShares;
              if (abi.bignum(askShares).gt(constants.PRECISION.zero)) {
                self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
              }
              if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
                self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
              }
            }
          } else {
            self.getOrderBook(marketID, function (updatedOrderBook) {
              if (!updatedOrderBook || updatedOrderBook.error) return console.error("getOrderBook:", updatedOrderBook);
              var orderBook = {};
              orderBook[marketID] = updatedOrderBook;
              var tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBook, address);
              if (tradeIDs && tradeIDs.length) {
                self.placeShortSell(market, outcomeID, res.remainingShares, limitPrice, address, totalCost, tradingFees, orderBook, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
              } else if (!doNotMakeOrders) {
                self.placeShortAsk(market, outcomeID, res.remainingShares, limitPrice, tradeGroupID);
              }
            });
          }
        });
      }
    });
  },

  placeShortSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback) {
    var self = this;
    tradeCommitLockCallback(true);
    var marketID = market.id;
    var getTradeIDs = function (orderBooks) {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeShortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, function (err, res) {
      tradeCommitLockCallback(false);
      if (err) return console.error("short sell failed:", err);
      if (res.remainingShares.gt(constants.PRECISION.zero) && !doNotMakeOrders) {
        self.placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice, tradeGroupID);
      }
    });
  }

};
