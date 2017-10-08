"use strict";

var parametrizeFilter = require("./parametrize-filter");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");

function getFilteredLogs(contractName, eventName, filterParams, callback) {
  var filter = parametrizeFilter(eventsAbi[eventName], filterParams || {});
  ethrpc.getLogs(filter, function (logs) {
    if (logs && logs.error) return callback(logs, null);
    if (!logs || !logs.length) return callback(null, []);
    callback(null, logs);
  });
}

module.exports = getFilteredLogs;
