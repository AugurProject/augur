"use strict";

var abi = require("augur-abi");
var api = require("../../api");
var normalizePrice = require("../../trading/normalize-price");
var noop = require("../../utils/noop");

function generateOrder(type, market, outcome, amount, price, bounds, callback) {
  api().MakeOrder.publicMakeOrder({
    fxpAmount: abi.fix(amount, "hex"),
    fxpPrice: normalizePrice(bounds.minValue, bounds.maxValue, price),
    market: market,
    outcome: outcome,
    betterOrderID: 0,
    worseOrderID: 0,
    onSent: noop,
    onSuccess: function (res) {
      callback(null, {
        id: res.callReturn,
        type: type,
        market: market,
        outcome: outcome,
        amount: amount,
        price: price,
        timestamp: res.timestamp,
        hash: res.hash,
        gasUsed: res.gasUsed
      });
    },
    onFailed: callback
  });
}

module.exports = generateOrder;
