"use strict";

var clone = require("clone");
var getShortSellLogs = require("./get-short-sell-logs");
var isFunction = require("../utils/is-function");

function getTakerShortSellLogs(account, filterParams, callback) {
  var params;
  if (!callback && isFunction(filterParams)) {
    callback = filterParams;
    filterParams = null;
  }
  params = clone(filterParams || {});
  params.maker = false;
  return getShortSellLogs(account, params, callback);
}

module.exports = getTakerShortSellLogs;
