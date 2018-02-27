"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var getBetterWorseOrders = require("./get-better-worse-orders");
var tradeUntilAmountIsZero = require("./trade-until-amount-is-zero");
var normalizePrice = require("./normalize-price");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.amount Number of shares to trade, as a base-10 string.
 * @param {string} p.limitPrice Display (non-normalized) limit price for this trade, as a base-10 string.
 * @param {string} p.estimatedCost Total cost (in ETH) of this trade, as a base-10 string.
 * @param {string} p.minPrice The minimum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p.maxPrice The maximum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {string} p.tickSize The tick size (interval) for this market.
 * @param {number} p._direction Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [0, 7].
 * @param {string=} p.estimatedCost Total cost (in ETH) of this trade, as a base-10 string.
 * @param {string=} p._tradeGroupId ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 * @param {boolean=} p.doNotCreateOrders If set to true, this trade will only take existing orders off the book, not create new ones (default: false).
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called when the first trading transaction is broadcast to the network.
 * @param {function} p.onSuccess Called when the full trade completes successfully.
 * @param {function} p.onFailed Called if any part of the trade fails.
 */
function placeTrade(p) {
  var normalizedPrice = normalizePrice({ minPrice: p.minPrice, maxPrice: p.maxPrice, price: p.limitPrice });
  var orderType = (["buy", "sell"])[p._direction];
  getBetterWorseOrders({
    orderType: orderType,
    marketId: p._market,
    outcome: p._outcome,
    price: p.limitPrice,
  }, function (err, betterWorseOrders) {
    if (err) return p.onFailed(err);
    tradeUntilAmountIsZero(assign({}, immutableDelete(p, ["limitPrice", "amount", "minPrice", "maxPrice"]), {
      _price: normalizedPrice,
      _fxpAmount: p.amount,
      _betterOrderId: betterWorseOrders.betterOrderId,
      _worseOrderId: betterWorseOrders.worseOrderId,
    }));
  });
}

module.exports = placeTrade;
