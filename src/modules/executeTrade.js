"use strict";

var BigNumber = require("bignumber.js");
var async = require("async");
var abi = require("augur-abi");
var selectOrder = require("./selectOrder");
var constants = require("../constants");

module.exports = {

  // if buying numShares must be 0, if selling totalEthWithFee must be 0
  executeTrade: function (marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
    console.log("executeTrade:", marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks);
    var self = this;
    var bnTotalEth = abi.bignum(totalEthWithFee) || constants.ZERO;
    var bnNumShares = abi.bignum(numShares) || constants.ZERO;
    var res = {
      remainingEth: bnTotalEth,
      remainingShares: bnNumShares,
      filledShares: constants.ZERO,
      filledEth: constants.ZERO,
      tradingFees: constants.ZERO,
      gasFees: constants.ZERO
    };
    var matchingTradeIDs;
    var bnSharesPurchased = bnNumShares;
    var bnCashBalance = bnTotalEth;
    async.until(function () {
      matchingTradeIDs = getTradeIDs();
      console.log("matchingTradeIDs:", matchingTradeIDs);
      console.log("remainingEth:", res.remainingEth.toFixed());
      console.log("remainingShares:", res.remainingShares.toFixed());
      console.log("sharesPurchased:", bnSharesPurchased.toFixed());
      console.log("balance:", bnCashBalance.toFixed());
      return !matchingTradeIDs || !matchingTradeIDs.length ||
        (res.remainingEth.lte(constants.PRECISION.zero) && res.remainingShares.lte(constants.PRECISION.zero)) ||
        (bnNumShares.gt(constants.ZERO) && bnSharesPurchased.lte(constants.PRECISION.zero)) ||
        (bnTotalEth.gt(constants.ZERO) && bnCashBalance.lte(constants.PRECISION.zero));
    }, function (nextTrade) {
      var tradeIDs = matchingTradeIDs;
      tradeIDs = tradeIDs.slice(0, 3);
      self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        bnSharesPurchased = abi.bignum(sharesPurchased);
        self.getCashBalance(address, function (cashBalance) {
          bnCashBalance = abi.bignum(cashBalance);
          var isRemainder;
          var maxAmount;
          if (res.remainingShares.gt(bnSharesPurchased)) {
            maxAmount = bnSharesPurchased;
            isRemainder = true;
          } else {
            maxAmount = res.remainingShares;
            isRemainder = false;
          }
          var maxValue = BigNumber.min(res.remainingEth, bnCashBalance);
          self.trade({
            max_value: maxValue.toFixed(),
            max_amount: maxAmount.toFixed(),
            trade_ids: tradeIDs,
            tradeGroupID: tradeGroupID,
            sender: address,
            onTradeHash: function (tradeHash) {
              tradeCommitmentCallback({
                tradeHash: abi.format_int256(tradeHash),
                orders: tradeIDs.map(function (tradeID) {
                  return selectOrder.selectOrder(tradeID, orderBooks);
                }),
                maxValue: maxValue.toFixed(),
                maxAmount: maxAmount.toFixed(),
                remainingEth: res.remainingEth.toFixed(),
                remainingShares: res.remainingShares.toFixed(),
                filledEth: res.filledEth.toFixed(),
                filledShares: res.filledShares.toFixed(),
                tradingFees: res.tradingFees.gt(constants.ZERO) ? res.tradingFees.toFixed() : tradingFees,
                gasFees: res.gasFees.toFixed()
              });
            },
            onCommitSent: function (data) { console.log("commit sent:", data); },
            onCommitSuccess: function (data) {
              res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
              tradeCommitmentCallback({ gasFees: res.gasFees.toFixed() });
            },
            onCommitFailed: nextTrade,
            onNextBlock: function (data) { console.log("trade-onNextBlock", data); },
            onTradeSent: function (data) { console.log("trade sent:", data); },
            onTradeSuccess: function (data) {
              console.log("trade success:", data);
              res.filledShares = res.filledShares.plus(abi.bignum(data.sharesBought));
              res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
              if (isRemainder) {
                res.remainingShares = res.remainingShares.minus(maxAmount).plus(abi.bignum(data.unmatchedShares));
              } else {
                res.remainingShares = abi.bignum(data.unmatchedShares);
              }
              res.remainingEth = abi.bignum(data.unmatchedCash);
              res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
              res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
              tradeCommitmentCallback({
                filledShares: res.filledShares.toFixed(),
                filledEth: res.filledEth.toFixed(),
                remainingShares: res.remainingShares.toFixed(),
                remainingEth: res.remainingEth.toFixed(),
                tradingFees: res.tradingFees.toFixed(),
                gasFees: res.gasFees.toFixed()
              });
              self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
                bnSharesPurchased = abi.bignum(sharesPurchased);
                self.getCashBalance(address, function (cashBalance) {
                  bnCashBalance = abi.bignum(cashBalance);
                  nextTrade();
                });
              });
            },
            onTradeFailed: nextTrade
          });
        });
      });
    }, function (err) {
      if (err) return cb(err);
      console.log("trade complete:", JSON.stringify(res, null, 2));
      cb(null, res);
    });
  },

  executeShortSell: function (marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
    var self = this;
    var res = {
      remainingShares: abi.bignum(numShares) || constants.ZERO,
      filledShares: constants.ZERO,
      filledEth: constants.ZERO,
      tradingFees: constants.ZERO,
      gasFees: constants.ZERO
    };
    var matchingIDs = getTradeIDs();
    console.log("matching trade IDs:", matchingIDs);
    if (!matchingIDs || !matchingIDs.length || res.remainingShares.lte(constants.ZERO)) return cb(null, res);
    async.eachSeries(matchingIDs, function (matchingID, nextMatchingID) {
      var maxAmount = res.remainingShares.toFixed();
      self.short_sell({
        max_amount: maxAmount,
        buyer_trade_id: matchingID,
        sender: address,
        tradeGroupID: tradeGroupID,
        onTradeHash: function (tradeHash) {
          tradeCommitmentCallback({
            tradeHash: abi.format_int256(tradeHash),
            orders: [selectOrder.selectOrder(matchingID, orderBooks)],
            maxValue: "0",
            maxAmount: maxAmount,
            remainingEth: "0",
            remainingShares: res.remainingShares.toFixed(),
            filledEth: res.filledEth.toFixed(),
            filledShares: res.filledShares.toFixed(),
            tradingFees: res.tradingFees.gt(constants.ZERO) ? res.tradingFees.toFixed() : tradingFees,
            gasFees: res.gasFees.toFixed()
          });
        },
        onCommitSent: function (data) { console.log("short sell commit sent:", data); },
        onCommitSuccess: function (data) {
          res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
          tradeCommitmentCallback({ gasFees: res.gasFees.toFixed() });
        },
        onCommitFailed: nextMatchingID,
        onNextBlock: function (data) { console.log("short_sell onNextBlock", data); },
        onTradeSent: function (data) { console.debug("short sell sent", data); },
        onTradeSuccess: function (data) {
          if (data.unmatchedShares) {
            res.remainingShares = abi.bignum(data.unmatchedShares);
          } else {
            res.remainingShares = constants.ZERO;
          }
          if (data.matchedShares) {
            res.filledShares = res.filledShares.plus(abi.bignum(data.matchedShares));
          }
          if (data.cashFromTrade) {
            res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
          }
          res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
          res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
          tradeCommitmentCallback({
            filledShares: res.filledShares.toFixed(),
            filledEth: res.filledEth.toFixed(),
            remainingShares: res.remainingShares.toFixed(),
            tradingFees: res.tradingFees.toFixed(),
            gasFees: res.gasFees.toFixed()
          });
          if (res.remainingShares.gt(constants.PRECISION.zero)) return nextMatchingID();
          nextMatchingID({ isComplete: true });
        },
        onTradeFailed: nextMatchingID
      });
    }, function (err) {
      if (err && !err.isComplete) return cb(err);
      console.log("short_sell success:", JSON.stringify(res, null, 2));
      cb(null, res);
    });
  }

};
