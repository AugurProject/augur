"use strict";

var abi = require("augur-abi");
var shrinkScalarPrice = require("../shrink-scalar-price");
var api = require("../../api");
var isObject = require("../../utils/is-object");
var MINIMUM_TRADE_SIZE = require("../../constants").MINIMUM_TRADE_SIZE;

function sell(amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed) {
  if (isObject(amount)) {
    price = amount.price;
    market = amount.market;
    outcome = amount.outcome;
    tradeGroupID = amount.tradeGroupID;
    scalarMinMax = amount.scalarMinMax;
    onSent = amount.onSent;
    onSuccess = amount.onSuccess;
    onFailed = amount.onFailed;
    amount = amount.amount;
  }
  if (scalarMinMax && scalarMinMax.minValue !== undefined) {
    price = shrinkScalarPrice(scalarMinMax.minValue, price);
  }
  return api.BuyAndSellShares.sell(abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome, abi.fix(MINIMUM_TRADE_SIZE, "hex"), 0, tradeGroupID || 0, onSent, onSuccess, onFailed);
}

module.exports = sell;
