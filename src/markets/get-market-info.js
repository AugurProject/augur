"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

// account is optional, if provided will return sharesPurchased
function getMarketInfo(market, account, callback) {
  if (isObject(market)) {
    callback = callback || market.callback;
    account = market.account;
    market = market.market;
  }
  if (!callback && isFunction(account)) {
    callback = account;
    account = null;
  }
  return api().CompositeGetters.getMarketInfo(market, account || 0, callback);
}

module.exports = getMarketInfo;
