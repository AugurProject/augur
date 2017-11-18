"use strict";

var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var getBetterWorseOrders = require("./get-better-worse-orders");
var tradeUntilAmountIsZero = require("./trade-until-amount-is-zero");
var normalizePrice = require("./normalize-price");
var convertDecimalToFixedPoint = require("../utils/convert-decimal-to-fixed-point");
var api = require("../api");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.amount Number of shares to trade, as a base-10 string.
 * @param {string} p.limitPrice Display (non-normalized) limit price for this trade, as a base-10 string.
 * @param {string} p.minPrice The minimum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p.maxPrice The maximum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {number} p._direction Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [0, 7].
 * @param {string=} p._tradeGroupId ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 * @param {boolean=} p.doNotCreateOrders If set to true, this trade will only take existing orders off the book, not create new ones (default: false).
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called when the first trading transaction is broadcast to the network.
 * @param {function} p.onSuccess Called when the full trade completes successfully.
 * @param {function} p.onFailed Called if any part of the trade fails.
 */
function placeTrade(p) {
  if (new BigNumber(p.amount, 10).lte(constants.MINIMUM_TRADE_SIZE)) {
    return p.onSuccess(null);
  }
  var normalizedPrice = normalizePrice({ minPrice: p.minPrice, maxPrice: p.maxPrice, price: p.limitPrice });
  getBetterWorseOrders({
    marketID: p._market,
    outcome: p._outcome,
    amount: p.amount,
    price: normalizedPrice,
  }, function (err, betterWorseOrders) {
    if (err) return p.onFailed(err);
    if (betterWorseOrders.immediateFill === true) {
      tradeUntilAmountIsZero(assign({}, immutableDelete(p, ["limitPrice", "amount", "minPrice", "maxPrice"]), {
        _price: normalizedPrice,
        _fxpAmount: p.amount,
      }));
    } else {
      var numTicks = p.numTicks || constants.DEFAULT_NUM_TICKS;
      api().CreateOrder.publicCreateOrder(assign({}, immutableDelete(p, ["doNotCreateOrders", "minPrice", "maxPrice", "numTicks", "amount", "limitPrice", "_direction"]), {
        _type: p._direction,
        _attoshares: convertDecimalToFixedPoint(p.amount, numTicks),
        _displayPrice: convertDecimalToFixedPoint(normalizedPrice, numTicks),
        _betterOrderId: betterWorseOrders.betterOrderID,
        _worseOrderId: betterWorseOrders.worseOrderID,
      }));
    }
  });
}

module.exports = placeTrade;
