"use strict";

var parametrizeFilter = require("./parametrize-filter");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");

function getFilteredLogs(contractName, eventName, filterParams, callback) {
  var filter = parametrizeFilter(eventsAbi[eventName], filterParams || {});
  ethrpc.getLogs(filter, function (err, logs) {
    if (err) return callback(err);
    if (!logs || !logs.length) return callback(null, []);
    callback(null, logs);
  });
}

module.exports = getFilteredLogs;
