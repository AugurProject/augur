"use strict";

var api = require("../../api");
var noop = require("../../utils/noop");

function generateOrder(type, market, outcome, amount, price, scalarMinMax, callback) {
  var makeOrder;
  makeOrder = (type === "buy") ? api.BuyAndSellShares.buy : api.BuyAndSellShares.sell;
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
