"use strict";

var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var calculateUnrealizedPL = require("./calculate-unrealized-pl");
var calculateTradesPL = require("./calculate-trades-pl");
var updateRealizedPL = require("./update-realized-pl");
var constants = require("../../constants");
var ZERO = constants.ZERO;

/**
 * Calculates realized and unrealized profit/loss for trades in a single outcome.
 *
 * Note: buy/sell labels are from taker's point-of-view.
 *
 * @param {Object} p Parameters object.
 * @param {Object[]} p.trades Trades for a single outcome {type, amount, price, maker}.
 * @param {string=} p.lastPrice Price of this outcome's most recent trade, as a base-10 string (default: 0).
 * @return {Object} Realized and unrealized P/L {position, realized, unrealized}.
 */
function calculateProfitLoss(p) {
  var PL = {
    position: ZERO,
    meanOpenPrice: ZERO,
    realized: ZERO,
    unrealized: ZERO,
    queued: ZERO,
    completeSetsBought: ZERO,
    tradeQueue: [],
  };
  var lastPrice = p.lastPrice == null ? ZERO : new BigNumber(p.lastPrice, 10);
  if (p.trades) {
    PL = calculateTradesPL(PL, p.trades);
    // console.log("Raw P/L:", JSON.stringify(PL, null, 2));
    var queuedShares = ZERO;
    if (PL.tradeQueue && PL.tradeQueue.length) {
      // console.log("Trade queue:", JSON.stringify(PL.tradeQueue));
      for (var i = 0, n = PL.tradeQueue.length; i < n; ++i) {
        queuedShares = queuedShares.plus(PL.tradeQueue[i].shares);
        PL.queued = updateRealizedPL(PL.tradeQueue[i].meanOpenPrice, PL.queued, PL.tradeQueue[i].shares.negated(), PL.tradeQueue[i].price);
      }
    }
    // console.log("Queued shares:", queuedShares.toFixed());
    // console.log("Last trade price:", lastPrice.toFixed());
    PL.unrealized = calculateUnrealizedPL(PL.position, PL.meanOpenPrice, lastPrice);
    // console.log("Unrealized P/L:", PL.unrealized.toFixed());
    if (PL.position.abs().lt(constants.PRECISION.zero)) {
      PL.position = ZERO;
      PL.meanOpenPrice = ZERO;
      PL.unrealized = ZERO;
    }
  }
  PL.position = PL.position.toFixed();
  PL.meanOpenPrice = PL.meanOpenPrice.toFixed();
  PL.realized = PL.realized.plus(PL.queued);
  PL.total = PL.realized.plus(PL.unrealized).toFixed();
  PL.realized = PL.realized.toFixed();
  PL.unrealized = PL.unrealized.toFixed();
  // console.log("Queued P/L:", PL.queued.toFixed());
  return immutableDelete(PL, ["completeSetsBought", "tradeQueue", "queued"]);
}

module.exports = calculateProfitLoss;
