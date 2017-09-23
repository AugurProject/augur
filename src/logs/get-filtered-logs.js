"use strict";

var eventsABI = require("../contracts").abi.events;
var parametrizeFilter = require("./parametrize-filter");
var ethrpc = require("../rpc-interface");

function getFilteredLogs(label, filterParams, callback) {
  var filter = parametrizeFilter(eventsABI[label], filterParams || {});
  ethrpc.getLogs(filter, function (logs) {
    if (logs && logs.error) return callback(logs, null);
    if (!logs || !logs.length) return callback(null, []);
    callback(null, logs);
  });
}

module.exports = getFilteredLogs;
