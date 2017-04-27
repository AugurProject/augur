"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

// { market, account }
function getPositionInMarket(p, callback) {
  return api().CompositeGetters.getPositionInMarket({
    market: p.market,
    account: p.account
  }, callback);
}

module.exports = getPositionInMarket;
