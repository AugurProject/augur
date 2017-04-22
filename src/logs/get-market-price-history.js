"use strict";

var clone = require("clone");
var getLogs = require("./get-logs");
var isFunction = require("../utils/is-function");

function getMarketPriceHistory(market, options, callback) {
  var params, aux;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  params = clone(options || {});
  params.market = market;
  aux = { index: "outcome", mergedLogs: {} };
  if (!isFunction(callback)) {
    getLogs("log_fill_tx", params, aux);
    getLogs("log_short_fill_tx", params, aux);
    return aux.mergedLogs;
  }
  getLogs("log_fill_tx", params, aux, function (err) {
    if (err) return callback(err);
    getLogs("log_short_fill_tx", params, aux, function (err) {
      if (err) return callback(err);
      callback(null, aux.mergedLogs);
    });
  });
}

module.exports = getMarketPriceHistory;
