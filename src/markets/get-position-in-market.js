"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function getPositionInMarket(market, account, callback) {
  if (!callback && isFunction(account)) {
    callback = account;
    account = null;
  }
  if (isObject(market)) {
    account = market.account;
    callback = callback || market.callback;
    market = market.market;
  }
  return api.CompositeGetters.getPositionInMarket(market, account, callback);
}

module.exports = getPositionInMarket;
