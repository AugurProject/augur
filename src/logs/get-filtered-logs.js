"use strict";

var eventsAPI = require("../contracts").api.events;
var parametrizeFilter = require("./parametrize-filter");
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");

function getFilteredLogs(label, filterParams, callback) {
  var filter;
  if (!callback && isFunction(filterParams)) {
    callback = filterParams;
    filterParams = null;
  }
  filter = parametrizeFilter(eventsAPI[label], filterParams || {});
  if (!isFunction(callback)) return rpcInterface.getLogs(filter);
  rpcInterface.getLogs(filter, function (logs) {
    if (logs && logs.error) return callback(logs, null);
    if (!logs || !logs.length) return callback(null, []);
    callback(null, logs);
  });
}

module.exports = getFilteredLogs;
