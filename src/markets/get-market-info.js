"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

// account is optional, if provided will return sharesPurchased
// { marketID, account }
function getMarketInfo(p, callback) {
  return api().CompositeGetters.getMarketInfo({
    marketID: p.marketID,
    account: p.account || 0
  }, callback);
}

module.exports = getMarketInfo;
