"use strict";

var BigNumber = require("bignumber.js");
var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");
var splitOrder = require("./splitOrder");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  // market: {id, type, minValue (for scalars)}
  placeTrade: function (market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, orderBooks, tradeCommitmentCallback, tradeCommitLockCallback, callback) {
    if (!tradeCommitmentCallback) tradeCommitmentCallback = utils.noop;
    if (!tradeCommitLockCallback) tradeCommitLockCallback = utils.noop;
    var self = this;
    var marketID = market.id;
    var tradeGroupID = abi.format_int256(new Buffer(uuidParse.parse(uuid.v4())).toString("hex"));
    if (tradeType === "buy") {
      var tradeIDs = this.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
      console.log('buy trade IDs:', tradeIDs);
      if (tradeIDs && tradeIDs.length) {
        console.log('place buy:', market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID);
        this.placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
      } else {
        console.log('place bid:', market, outcomeID, numShares, limitPrice, tradeGroupID);
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
            self.placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
          } else {
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
          self.placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback, tradeCommitLockCallback);
        } else {
          self.placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID);
        }
        callback(null);
      });
    }
    return tradeGroupID;
  }

};
