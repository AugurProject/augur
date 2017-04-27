"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

// { marketIDs, account }
function batchGetMarketInfo(p, callback) {
  return api().CompositeGetters.batchGetMarketInfo({
    marketIDs: p.marketIDs,
    account: p.account || 0
  }, callback, { extraArgument: p.marketIDs.length });
}

module.exports = batchGetMarketInfo;
