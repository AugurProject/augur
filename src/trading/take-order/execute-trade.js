"use strict";

var abi = require("augur-abi");
var async = require("async");
var BigNumber = require("bignumber.js");
var selectOrder = require("./select-order");
var trade = require("./trade");
var api = require("../../api");
var noop = require("../../utils/noop");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

// if buying numShares must be 0, if selling totalEthWithFee must be 0
function executeTrade(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
  var bnTotalEth, bnNumShares, res, matchingTradeIDs, bnSharesPurchased, bnCashBalance, commitMaxAmount, commitMaxValue;
  bnTotalEth = abi.bignum(totalEthWithFee) || ZERO;
  bnNumShares = abi.bignum(numShares) || ZERO;
  res = {
    remainingEth: bnTotalEth,
    remainingShares: bnNumShares,
    filledShares: ZERO,
    filledEth: ZERO,
    tradingFees: ZERO,
    gasFees: ZERO
  };
  bnSharesPurchased = bnNumShares;
  bnCashBalance = bnTotalEth;
  if (bnNumShares.gt(ZERO)) {
    commitMaxAmount = numShares;
    commitMaxValue = "0";
  } else {
    commitMaxAmount = "0";
    commitMaxValue = totalEthWithFee;
  }
  async.until(function () {
    matchingTradeIDs = getTradeIDs(getOrderBooks());
    return !matchingTradeIDs || !matchingTradeIDs.length ||
      (res.remainingEth.lte(PRECISION.zero) && res.remainingShares.lte(PRECISION.zero)) ||
      (bnNumShares.gt(ZERO) && bnSharesPurchased.lte(PRECISION.zero)) ||
      (bnTotalEth.gt(ZERO) && bnCashBalance.lte(PRECISION.zero));
  }, function (nextTrade) {
    var tradeIDs = matchingTradeIDs.slice(0, 3);
    api().Markets.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
      bnSharesPurchased = abi.bignum(sharesPurchased);
      api().Cash.balance(address, function (cashBalance) {
        var isRemainder, maxAmount, maxValue;
        bnCashBalance = abi.bignum(cashBalance);
        if (res.remainingShares.gt(bnSharesPurchased)) {
          maxAmount = bnSharesPurchased;
          isRemainder = true;
        } else {
          maxAmount = res.remainingShares;
          isRemainder = false;
        }
        maxValue = BigNumber.min(res.remainingEth, bnCashBalance);
        trade({
          max_value: maxValue.toFixed(),
          max_amount: maxAmount.toFixed(),
          trade_ids: tradeIDs,
          tradeGroupID: tradeGroupID,
          sender: address,
          onTradeHash: function (tradeHash) {
            tradeCommitmentCallback({
              tradeHash: abi.format_int256(tradeHash),
              orders: tradeIDs.map(function (tradeID) {
                return selectOrder(tradeID, getOrderBooks());
              }),
              maxValue: commitMaxValue,
              maxAmount: commitMaxAmount,
              remainingEth: res.remainingEth.toFixed(),
              remainingShares: res.remainingShares.toFixed(),
              filledEth: res.filledEth.toFixed(),
              filledShares: res.filledShares.toFixed(),
              tradingFees: res.tradingFees.gt(ZERO) ? res.tradingFees.toFixed() : tradingFees,
              gasFees: res.gasFees.toFixed()
            });
          },
          onCommitSent: noop,
          onCommitSuccess: function (data) {
            res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
            tradeCommitmentCallback({ gasFees: res.gasFees.toFixed() });
          },
          onCommitFailed: nextTrade,
          onNextBlock: noop,
          onTradeSent: noop,
          onTradeSuccess: function (data) {
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
            api().Markets.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
              bnSharesPurchased = abi.bignum(sharesPurchased);
              api().Cash.balance(address, function (cashBalance) {
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
    cb(null, res);
  });
}

module.exports = executeTrade;
