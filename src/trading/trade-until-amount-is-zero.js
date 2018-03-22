"use strict";

var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var immutableDelete = require("immutable-delete");
var calculateTradeCost = require("./calculate-trade-cost");
var calculateTickSize = require("./calculate-tick-size");
var calculateOnChainFillPrice = require("./calculate-on-chain-fill-price");
var getTradeAmountRemaining = require("./get-trade-amount-remaining");
var convertBigNumberToHexString = require("../utils/convert-big-number-to-hex-string");
var convertOnChainAmountToDisplayAmount = require("../utils/convert-on-chain-amount-to-display-amount");
var api = require("../api");
var ethrpc = require("../rpc-interface");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._price Normalized limit price for this trade, as a base-10 string.
 * @param {string} p._fxpAmount Number of shares to trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {number} p._direction Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [0, 7].
 * @param {string} p.minPrice The minimum display price for this market, as a base-10 string.
 * @param {string} p.maxPrice The maximum display price for this market, as a base-10 string.
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
  var displayAmount = p._fxpAmount;
  var displayPrice = p._price;
  var orderType = p._direction;
  var tradeCost = calculateTradeCost({
    displayPrice: displayPrice,
    displayAmount: displayAmount,
    numTicks: p.numTicks,
    orderType: orderType,
    minDisplayPrice: p.minPrice,
    maxDisplayPrice: p.maxPrice,
  });
  var maxCost = tradeCost.cost;
  var onChainAmount = tradeCost.onChainAmount;
  var onChainPrice = tradeCost.onChainPrice;
  var cost = (p.estimatedCost != null && new BigNumber(p.estimatedCost, 10).gt(constants.ZERO)) ? speedomatic.fix(p.estimatedCost) : maxCost;
  console.log("cost:", cost.toFixed(), "wei", speedomatic.unfix(cost, "string"), "eth");
  if (cost.lt(constants.PRECISION.zero)) {
    console.info("tradeUntilAmountIsZero complete: only dust remaining");
    return p.onSuccess(null);
  }
  ethrpc.eth.gasPrice(null, function (err, gasPrice) {
    if (err) return p.onFailed(err);
    var estimatedGasCost = new BigNumber(constants.TRADE_GAS, 16).times(new BigNumber(gasPrice, 16));
    console.log("estimated gas cost:", estimatedGasCost.toFixed(), "wei", speedomatic.unfix(estimatedGasCost, "string"), "eth");
    if (estimatedGasCost.gt(cost)) {
      console.info("tradeUntilAmountIsZero complete: only dust remaining");
      return p.onSuccess(null);
    }
    var tradePayload = assign({}, immutableDelete(p, ["doNotCreateOrders", "numTicks", "estimatedCost", "minPrice", "maxPrice"]), {
      tx: assign({ value: convertBigNumberToHexString(cost), gas: constants.TRADE_GAS }, p.tx),
      _fxpAmount: convertBigNumberToHexString(onChainAmount),
      _price: convertBigNumberToHexString(onChainPrice),
      onSuccess: function (res) {
        var tickSize = calculateTickSize(p.numTicks, p.minPrice, p.maxPrice);
        var onChainFillPrice = calculateOnChainFillPrice(orderType, onChainPrice, p.numTicks);
        getTradeAmountRemaining({
          transactionHash: res.hash,
          startingOnChainAmount: onChainAmount,
          onChainFillPrice: onChainFillPrice,
          tickSize: tickSize,
        }, function (err, tradeOnChainAmountRemaining) {
          if (err) return p.onFailed(err);
          console.log("starting amount: ", onChainAmount.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(onChainAmount, tickSize).toFixed(), "shares");
          console.log("remaining amount:", tradeOnChainAmountRemaining.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, tickSize).toFixed(), "shares");
          if (new BigNumber(tradeOnChainAmountRemaining, 10).eq(onChainAmount)) {
            if (p.doNotCreateOrders) return p.onSuccess(tradeOnChainAmountRemaining);
            return p.onFailed(new Error("Trade completed but amount of trade unchanged"));
          }
          var updatedEstimatedCost = p.estimatedCost == null ? null : speedomatic.unfix(cost.minus(new BigNumber(res.value, 16)), "string");
          console.log("actual cost:     ", cost.toFixed(), "wei", speedomatic.unfix(cost, "string"), "eth");
          if (updatedEstimatedCost != null) {
            console.log("estimated cost:     ", speedomatic.fix(p.estimatedCost, "string"), "wei", p.estimatedCost, "eth");
            console.log("value of last trade:", new BigNumber(res.value, 16).toFixed(), "wei", speedomatic.unfix(res.value, "string"), "eth");
            console.log("updated estimated cost:", speedomatic.fix(updatedEstimatedCost, "string"), "wei", updatedEstimatedCost, "eth");
          }
          tradeUntilAmountIsZero(assign({}, p, {
            estimatedCost: updatedEstimatedCost,
            _fxpAmount: convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, tickSize).toFixed(),
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
  });
}

module.exports = tradeUntilAmountIsZero;
