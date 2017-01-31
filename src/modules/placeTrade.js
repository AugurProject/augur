"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");
var splitOrder = require("./splitOrder");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  generateTradeGroupID: function () {
    return abi.format_int256(new Buffer(uuidParse.parse(uuid.v4())).toString("hex"));
  },

  // marketID, marketType, minValue, outcomeID, tradeType, numShares, limitPrice, tradingFees, totalCost
  // orderBooks, address
  executeTradingActions: function (market, outcomeID, address, orderBooks, doNotMakeOrders, tradesInProgress, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    if (!tradeCommitmentCallback) tradeCommitmentCallback = utils.noop;
    if (!tradeCommitLockCallback) tradeCommitLockCallback = utils.noop;
    if (!callback) callback = utils.noop;
    var self = this;
    var tradeGroupID = this.generateTradeGroupID();
    async.eachSeries(tradesInProgress, function (tradeInProgress, nextTradeInProgress) {
      if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
        return nextTradeInProgress();
      }
      if (self.options.debug.trading) console.log('placing trade:', tradeInProgress);
      self.placeTrade(
        market,
        outcomeID,
        tradeInProgress.side,
        tradeInProgress.numShares,
        tradeInProgress.limitPrice,
        tradeInProgress.tradingFeesEth,
        address,
        abi.bignum(tradeInProgress.totalCost).abs().toFixed(),
        orderBooks,
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
  placeTrade: function (market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    var self = this;
    var marketID = market.id;
    if (tradeType === "buy") {
      var tradeIDs = this.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
      if (tradeIDs && tradeIDs.length) {
        this.placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
      } else if (!doNotMakeOrders) {
        this.placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID);
      }
      callback(null);
    } else if (tradeType === "sell") {

      // check if user has position
      //  - if so, sell/ask
      //  - if not, short sell/short ask
      this.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        if (!sharesPurchased || sharesPurchased.error) return callback(sharesPurchased);
        var position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
        var tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
        if (position && position.gt(constants.PRECISION.zero)) {
          if (tradeIDs && tradeIDs.length) {
            self.placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
          } else if (!doNotMakeOrders) {
            var shares = splitOrder(abi.bignum(numShares), position);
            var askShares = shares.askShares;
            var shortAskShares = shares.shortAskShares;
            if (abi.bignum(askShares).gt(constants.PRECISION.zero)) {
              self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
            }
            if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
              self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
            }
          }
        } else if (tradeIDs && tradeIDs.length) {
          self.placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, doNotMakeOrders, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
        } else if (!doNotMakeOrders) {
          self.placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID);
        }
        callback(null);
      });
    }
  }

};
