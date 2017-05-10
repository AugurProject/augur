"use strict";

var buy = require("../../trading/make-order/buy");
var sell = require("../../trading/make-order/sell");
var noop = require("../../utils/noop");

function generateOrder(type, market, outcome, amount, price, scalarMinMax, callback) {
  var makeOrder = (type === "buy") ? buy : sell;
  makeOrder({
    amount: amount,
    price: price,
    market: market,
    outcome: outcome,
    scalarMinMax: scalarMinMax,
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
