"use strict";

var abi = require("augur-abi");
var calculateUnrealizedPL = require("./calculate-unrealized-pl");
var calculateTradesPL = require("./calculate-trades-pl");
var updateRealizedPL = require("./update-realized-pl");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

/**
 * Calculates realized and unrealized profit/loss for trades in a single outcome.
 *
 * Note: buy/sell labels are from taker's point-of-view.
 *
 * @param {Array} trades Trades for a single outcome {type, shares, price, maker}.
 * @param {BigNumber|string} lastTradePrice Price of this outcome's most recent trade.
 * @return {Object} Realized and unrealized P/L {position, realized, unrealized}.
 */
function calculateProfitLoss(trades, lastTradePrice) {
  var PL, bnLastTradePrice, queuedShares, i, n;
  PL = {
    position: ZERO,
    meanOpenPrice: ZERO,
    realized: ZERO,
    unrealized: ZERO,
    queued: ZERO,
    completeSetsBought: ZERO,
    tradeQueue: []
  };
  bnLastTradePrice = abi.bignum(lastTradePrice) || ZERO;
  if (trades) {
    PL = calculateTradesPL(PL, trades);
    // console.log('Raw P/L:', JSON.stringify(PL, null, 2));
    queuedShares = ZERO;
    if (PL.tradeQueue && PL.tradeQueue.length) {
      // console.log('Trade queue:', JSON.stringify(PL.tradeQueue));
      for (i = 0, n = PL.tradeQueue.length; i < n; ++i) {
        queuedShares = queuedShares.plus(PL.tradeQueue[i].shares);
        PL.queued = updateRealizedPL(PL.tradeQueue[i].meanOpenPrice, PL.queued, PL.tradeQueue[i].shares.neg(), PL.tradeQueue[i].price);
      }
    }
    // console.log('Queued shares:', queuedShares.toFixed());
    // console.log('Last trade price:', bnLastTradePrice.toFixed());
    PL.unrealized = calculateUnrealizedPL(PL.position, PL.meanOpenPrice, bnLastTradePrice);
    // console.log('Unrealized P/L:', PL.unrealized.toFixed());
    if (PL.position.abs().lt(PRECISION.zero)) {
      PL.position = ZERO;
      PL.meanOpenPrice = ZERO;
      PL.unrealized = ZERO;
    }
  }
  PL.position = PL.position.toFixed();
  PL.meanOpenPrice = PL.meanOpenPrice.toFixed();
  PL.realized = PL.realized.toFixed();
  PL.unrealized = PL.unrealized.plus(PL.queued).toFixed();
  PL.queued = PL.queued.toFixed();
  // console.log('Queued P/L:', PL.queued);
  delete PL.completeSetsBought;
  delete PL.tradeQueue;
  return PL;
}

module.exports = calculateProfitLoss;
