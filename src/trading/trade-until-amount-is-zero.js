"use strict";

var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var immutableDelete = require("immutable-delete");
var calculateTradeCost = require("./calculate-trade-cost");
var getTradeAmountRemaining = require("./get-trade-amount-remaining");
var convertFixedPointToDecimal = require("../utils/convert-fixed-point-to-decimal");
var api = require("../api");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._price Normalized limit price for this trade, as a base-10 string.
 * @param {string} p._fxpAmount Number of shares to trade, as a base-10 string.
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
function tradeUntilAmountIsZero(p) {
  console.log("tradeUntilAmountIsZero:", JSON.stringify(immutableDelete(p, "meta"), null, 2));
  var tradeCost = calculateTradeCost({ price: p._price, amount: p._fxpAmount, numTicks: p.numTicks, tickSize: p.tickSize, orderType: p._direction });
  var maxCost = new BigNumber(tradeCost.cost, 16);
  var amountNumTicksRepresentation = tradeCost.amountNumTicksRepresentation;
  var priceNumTicksRepresentation = tradeCost.priceNumTicksRepresentation;
  var cost = p.estimatedCost != null && new BigNumber(p.estimatedCost, 10).gt(constants.ZERO) ? speedomatic.fix(p.estimatedCost) : maxCost;
  console.log("cost:", speedomatic.unfix(cost, "string"), "ETH");
  if (maxCost.lt(constants.PRECISION.zero)) {
    console.log("tradeUntilAmountIsZero complete: only dust remaining");
    return p.onSuccess(null);
  }
  var tradePayload = assign({}, immutableDelete(p, ["doNotCreateOrders", "numTicks", "tickSize", "estimatedCost"]), {
    tx: assign({ value: speedomatic.prefixHex(cost.toString(16)), gas: constants.TRADE_GAS }, p.tx),
    _fxpAmount: amountNumTicksRepresentation,
    _price: priceNumTicksRepresentation,
    onSuccess: function (res) {
      console.log("trade successful:", res);
      getTradeAmountRemaining({
        transactionHash: res.hash,
        startingOnChainAmount: amountNumTicksRepresentation,
        priceNumTicksRepresentation: priceNumTicksRepresentation,
      }, function (err, tradeOnChainAmountRemaining) {
        if (err) return p.onFailed(err);
        console.log("starting amount: ", p._fxpAmount);
        console.log("amount remaining:", convertFixedPointToDecimal(tradeOnChainAmountRemaining, speedomatic.fix(p.tickSize, "string")));
        if (new BigNumber(tradeOnChainAmountRemaining, 10).eq(new BigNumber(amountNumTicksRepresentation, 16))) {
          if (p.doNotCreateOrders) return p.onSuccess(tradeOnChainAmountRemaining);
          return p.onFailed("Trade completed but amount of trade unchanged");
        }
        var updatedEstimatedCost = p.estimatedCost == null ? null : speedomatic.unfix(cost.minus(new BigNumber(res.value, 16)), "string");
        console.log("updated estimated cost:", updatedEstimatedCost);
        tradeUntilAmountIsZero(assign({}, p, {
          estimatedCost: updatedEstimatedCost,
          _fxpAmount: convertFixedPointToDecimal(tradeOnChainAmountRemaining, speedomatic.fix(p.tickSize, "string")),
          onSent: noop, // so that p.onSent only fires when the first transaction is sent
        }));
      });
    },
  });
  if (p.doNotCreateOrders) {
    api().Trade.publicTakeBestOrder(tradePayload);
  } else {
    api().Trade.publicTrade(tradePayload);
  }
}

module.exports = tradeUntilAmountIsZero;
