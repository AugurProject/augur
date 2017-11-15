"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var speedomatic = require("speedomatic");
var getTradeAmountRemaining = require("./get-trade-amount-remaining");
var api = require("../api");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {number} p._direction Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [1, 8].
 * @param {string} p._amount Number of shares to trade, as a base-10 string.
 * @param {string} p._price Normalized limit price for this trade, as a base-10 string.
 * @param {string=} p._tradeGroupID ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 * @param {boolean=} p.doNotCreateOrders If set to true, this trade will only take existing orders off the book, not create new ones (default: false).
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called when the first trading transaction is broadcast to the network.
 * @param {function} p.onSuccess Called when the full trade completes successfully.
 * @param {function} p.onFailed Called if any part of the trade fails.
 */
function tradeUntilAmountIsZero(p) {
  if (speedomatic.unfix(p._amount).lte(constants.PRECISION.zero)) {
    return p.onSuccess(null);
  }
  var tradePayload = assign({}, immutableDelete(p, "doNotCreateOrders"), {
    _amount: speedomatic.fix(p._amount, "hex"),
    _price: speedomatic.fix(p._price, "hex"),
    onSuccess: function (res) {
      getTradeAmountRemaining({ transactionHash: res.hash }, function (err, fxpTradeAmountRemaining) {
        if (err) return p.onFailed(err);
        tradeUntilAmountIsZero(assign({}, p, {
          _amount: speedomatic.unfix(fxpTradeAmountRemaining, "string"),
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
