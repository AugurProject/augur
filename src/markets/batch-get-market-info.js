"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function batchGetMarketInfo(marketIDs, account, callback) {
  if (isObject(marketIDs)) {
    callback = callback || marketIDs.callback;
    account = marketIDs.account;
    marketIDs = marketIDs.marketIDs;
  }
  if (!callback && isFunction(account)) {
    callback = account;
    account = null;
  }
  return api().CompositeGetters.batchGetMarketInfo(marketIDs, account || 0, callback, { extraArgument: marketIDs.length });
}

module.exports = batchGetMarketInfo;
