"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var shrinkScalarPrice = require("../shrink-scalar-price");
var api = require("../../api");
var isObject = require("../../utils/is-object");
var MINIMUM_TRADE_SIZE = require("../../constants").MINIMUM_TRADE_SIZE;

// { amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed }
function shortAsk(p) {
  if (p.scalarMinMax && p.scalarMinMax.minValue !== undefined) {
    p.price = shrinkScalarPrice(p.scalarMinMax.minValue, p.price);
  }
  return api().BuyAndSellShares.shortAsk(assign({}, p, {
    amount: abi.fix(p.amount, "hex"),
    price: abi.fix(p.price, "hex"),
    minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, "hex"),
    tradeGroupID: p.tradeGroupID || 0
  }));
}

module.exports = shortAsk;
