"use strict";

var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var immutableDelete = require("immutable-delete");
var getTradeAmountRemaining = require("./get-trade-amount-remaining");
var convertDecimalToFixedPoint = require("../utils/convert-decimal-to-fixed-point");
var convertFixedPointToDecimal = require("../utils/convert-fixed-point-to-decimal");
var api = require("../api");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._price Display (non-normalized) limit price for this trade, as a base-10 string.
 * @param {string} p._fxpAmount Number of shares to trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {string} p.tickSize The tick size (interval) for this market.
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
function tradeUntilAmountIsZero(p) {
  console.log("tradeUntilAmountIsZero:", JSON.stringify(p, null, 2));
  var priceNumTicksRepresentation = convertDecimalToFixedPoint(p._price, p.numTicks);
  var adjustedPrice = p._direction === 0 ? new BigNumber(priceNumTicksRepresentation, 16) : new BigNumber(p.numTicks, 10).minus(new BigNumber(priceNumTicksRepresentation, 16));
  var onChainAmount = convertDecimalToFixedPoint(p._fxpAmount, speedomatic.fix(p.tickSize, "string"));
  var cost = new BigNumber(onChainAmount, 16).times(adjustedPrice);
  if (cost.lt(constants.PRECISION.zero)) return p.onSuccess(null);
  console.log("cost:", speedomatic.unfix(cost, "string"), "ether");
  var tradePayload = assign({}, immutableDelete(p, ["doNotCreateOrders", "numTicks", "tickSize"]), {
    tx: { value: speedomatic.hex(cost), gas: constants.TRADE_GAS },
    _fxpAmount: onChainAmount,
    _price: priceNumTicksRepresentation,
    onSuccess: function (res) {
      getTradeAmountRemaining({
        transactionHash: res.hash,
        startingOnChainAmount: onChainAmount,
        priceNumTicksRepresentation: priceNumTicksRepresentation,
      }, function (err, tradeOnChainAmountRemaining) {
        if (err) return p.onFailed(err);
        console.log("starting amount: ", p._fxpAmount);
        console.log("amount remaining:", convertFixedPointToDecimal(tradeOnChainAmountRemaining, speedomatic.fix(p.tickSize, "string")));
        if (new BigNumber(tradeOnChainAmountRemaining, 10).eq(new BigNumber(onChainAmount, 16))) {
          if (p.doNotCreateOrders) return p.onSuccess(tradeOnChainAmountRemaining);
          return p.onFailed("Trade completed but amount of trade unchanged");
        }
        tradeUntilAmountIsZero(assign({}, p, {
          _fxpAmount: convertFixedPointToDecimal(tradeOnChainAmountRemaining, speedomatic.fix(p.tickSize, "string")),
          onSent: noop, // so that p.onSent only fires when the first transaction is sent
        }));
      });
    },
  });
  console.log("tradePayload:", JSON.stringify(tradePayload, null, 2));
  if (p.doNotCreateOrders) {
    api().Trade.publicTakeBestOrder(tradePayload);
  } else {
    api().Trade.publicTrade(tradePayload);
  }
}

module.exports = tradeUntilAmountIsZero;
