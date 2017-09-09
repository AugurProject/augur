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
 * @param {number} p._direction Order type (1 for "buy", 2 for "sell").
 * @param {string} p._market Market in which to trade, as a hex string.
 * @param {number} p._outcome Outcome ID to trade, must be an integer value on [1, 8].
 * @param {string} p._fxpAmount Number of shares to trade, as a hex string.
 * @param {string} p._fxpPrice Limit price for this trade, as a hex string.
 * @param {string=} p._tradeGroupID ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 * @param {boolean=} p.doNotMakeOrders If set to true, this trade will only take existing orders off the book, not create new ones (default: false).
 * @param {buffer|function=} p._signer Can be the plaintext private key as a Buffer or the signing function to use.
 * @param {function} callback Called after the full trade is complete.
 */
function tradeUntilAmountIsZero(p, callback) {
  if (speedomatic.unfix(p._fxpAmount).lte(constants.PRECISION.zero)) {
    return callback(null);
  }
  var tradePayload = assign({}, immutableDelete(p, "doNotMakeOrders"), {
    onSuccess: function (res) {
      getTradeAmountRemaining({ transactionHash: res.hash }, function (err, fxpTradeAmountRemaining) {
        if (err) return callback(err);
        tradeUntilAmountIsZero(assign({}, p, {
          fxpAmount: fxpTradeAmountRemaining,
          onSent: noop
        }), callback);
      });
    }
  });
  if (p.doNotMakeOrders) {
    api().Trade.publicTakeBestOrder(tradePayload);
  } else {
    api().Trade.publicTrade(tradePayload);
  }
}

module.exports = tradeUntilAmountIsZero;
