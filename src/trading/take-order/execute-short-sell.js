"use strict";

var abi = require("augur-abi");
var async = require("async");
var selectOrder = require("./select-order");
var short_sell = require("./short-sell");
var noop = require("../../utils/noop");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function executeShortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, getOrderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
  var res = {
    remainingShares: abi.bignum(numShares) || ZERO,
    filledShares: ZERO,
    filledEth: ZERO,
    tradingFees: ZERO,
    gasFees: ZERO
  };
  var matchingIDs = getTradeIDs(getOrderBooks());
  if (!matchingIDs || !matchingIDs.length || res.remainingShares.lte(ZERO)) return cb(null, res);
  async.eachSeries(matchingIDs, function (matchingID, nextMatchingID) {
    var maxAmount = res.remainingShares.toFixed();
    short_sell({
      max_amount: maxAmount,
      buyer_trade_id: matchingID,
      sender: address,
      tradeGroupID: tradeGroupID,
      onTradeHash: function (tradeHash) {
        tradeCommitmentCallback({
          tradeHash: abi.format_int256(tradeHash),
          isShortSell: true,
          maxAmount: numShares,
          maxValue: "0",
          orders: [selectOrder(matchingID, getOrderBooks())],
          remainingEth: "0",
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
      onCommitFailed: nextMatchingID,
      onNextBlock: noop,
      onTradeSent: noop,
      onTradeSuccess: function (data) {
        if (data.unmatchedShares) {
          res.remainingShares = abi.bignum(data.unmatchedShares);
        } else {
          res.remainingShares = ZERO;
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
        if (res.remainingShares.gt(PRECISION.zero)) return nextMatchingID();
        nextMatchingID({ isComplete: true });
      },
      onTradeFailed: nextMatchingID
    });
  }, function (err) {
    if (err && !err.isComplete) return cb(err);
    cb(null, res);
  });
}

module.exports = executeShortSell;
