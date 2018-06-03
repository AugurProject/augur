"use strict";

var assign = require("lodash").assign;
var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var calculateTradeCost = require("./calculate-trade-cost");
var calculateTradeGas = require("./calculate-trade-gas");
var calculateTickSize = require("./calculate-tick-size");
var getTradeAmountRemaining = require("./get-trade-amount-remaining");
var convertBigNumberToHexString = require("../utils/convert-big-number-to-hex-string");
var convertOnChainAmountToDisplayAmount = require("../utils/convert-on-chain-amount-to-display-amount");
var api = require("../api");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._price Normalized limit price for this trade, as a base-10 string.
 * @param {string} p._fxpAmount Number of shares to trade, as a base-10 string.
 * @param {string} p.sharesProvided Number of shares already owned and provided for this trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {number} p._direction Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [0, 7].
 * @param {string} p.minPrice The minimum display price for this market, as a base-10 string.
 * @param {string} p.maxPrice The maximum display price for this market, as a base-10 string.
 * @param {string=} p._tradeGroupId ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 * @param {boolean=} p.doNotCreateOrders If set to true, this trade will only take existing orders off the book, not create new ones (default: false).
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called when the first trading transaction is broadcast to the network.
 * @param {function} p.onSuccess Called when the full trade completes successfully.
 * @param {function} p.onFailed Called if any part of the trade fails.
 */
function tradeUntilAmountIsZero(p) {
  console.log("tradeUntilAmountIsZero:", immutableDelete(p, ["meta", "onSent", "onSuccess", "onFailed"]));
  var displayAmount = p._fxpAmount;
  var displayPrice = p._price;
  var orderType = p._direction;
  var tradeCost = calculateTradeCost({
    displayPrice: displayPrice,
    displayAmount: displayAmount,
    sharesProvided: p.sharesProvided,
    numTicks: p.numTicks,
    orderType: orderType,
    minDisplayPrice: p.minPrice,
    maxDisplayPrice: p.maxPrice,
  });
  var onChainAmount = tradeCost.onChainAmount;
  var onChainPrice = tradeCost.onChainPrice;
  var cost = tradeCost.cost;
  console.log("cost:", cost.toFixed(), "wei", speedomatic.unfix(cost, "string"), "eth");
  if (tradeCost.onChainAmount.lt(constants.PRECISION.zero)) {
    console.info("tradeUntilAmountIsZero complete: only dust remaining");
    return p.onSuccess(null);
  }
  var tradePayload = assign({}, immutableDelete(p, ["doNotCreateOrders", "numTicks", "minPrice", "maxPrice", "sharesProvided"]), {
    tx: assign({ value: convertBigNumberToHexString(cost), gas: speedomatic.prefixHex(calculateTradeGas().toString(16)) }, p.tx),
    _fxpAmount: convertBigNumberToHexString(onChainAmount),
    _price: convertBigNumberToHexString(onChainPrice),
    onSuccess: function (res) {
      var tickSize = calculateTickSize(p.numTicks, p.minPrice, p.maxPrice);
      getTradeAmountRemaining({
        transactionHash: res.hash,
        startingOnChainAmount: onChainAmount,
        tickSize: tickSize,
      }, function (err, tradeOnChainAmountRemaining) {
        if (err) return p.onFailed(err);
        console.log("starting amount: ", onChainAmount.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(onChainAmount, tickSize).toFixed(), "shares");
        console.log("remaining amount:", tradeOnChainAmountRemaining.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, tickSize).toFixed(), "shares");
        if (tradeOnChainAmountRemaining.eq(onChainAmount)) {
          if (p.doNotCreateOrders) return p.onSuccess(tradeOnChainAmountRemaining.toFixed());
          return p.onFailed(new Error("Trade completed but amount of trade unchanged"));
        }
        var newAmount = convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, tickSize);
        var newSharesProvided = newAmount.minus(new BigNumber(displayAmount, 10).minus(new BigNumber(p.sharesProvided, 10)));
        newSharesProvided = newSharesProvided.lt(0) ? "0" : newSharesProvided.toFixed();
        tradeUntilAmountIsZero(assign({}, p, {
          _fxpAmount: newAmount.toFixed(),
          sharesProvided: newSharesProvided,
          onSent: noop, // so that p.onSent only fires when the first transaction is sent
        }));
      });
    },
  });
  if (p.doNotCreateOrders) {
    api().Trade.publicFillBestOrder(tradePayload);
  } else {
    api().Trade.publicTrade(tradePayload);
  }
}

module.exports = tradeUntilAmountIsZero;
