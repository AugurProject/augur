"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var shrinkScalarPrice = require("../shrink-scalar-price");
var api = require("../../api");
var isObject = require("../../utils/is-object");
var MINIMUM_TRADE_SIZE = require("../../constants").MINIMUM_TRADE_SIZE;

// { amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed }
function buy(p) {
  if (isObject(p.scalarMinMax) && p.scalarMinMax.minValue !== undefined) {
    p.price = shrinkScalarPrice(p.scalarMinMax.minValue, p.price);
  }
  return api().BuyAndSellShares.buy(assign({}, p, {
    amount: abi.fix(p.amount, "hex"),
    price: abi.fix(p.price, "hex"),
    market: p.market,
    outcome: p.outcome,
    minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, "hex"),
    tradeGroupID: p.tradeGroupID || 0,
    onSent: p.onSent,
    onSuccess: p.onSuccess,
    onFailed: p.onFailed
  }));
}

module.exports = buy;
