"use strict";

var getFilteredLogs = require("./get-filtered-logs");
var processLogs = require("./process-logs");
var isFunction = require("../utils/is-function");

// aux: {index: str/arr, mergedLogs: {}, extraField: {name, value}}
function getLogs(label, filterParams, aux, callback) {
  var logs;
  if (!isFunction(callback) && isFunction(aux)) {
    callback = aux;
    aux = null;
  }
  aux = aux || {};
  if (!isFunction(callback)) {
    logs = getFilteredLogs(label, filterParams || {});
    if (logs && logs.length) logs.reverse();
    return processLogs(label, aux.index, logs, aux.extraField, aux.mergedLogs);
  }
  getFilteredLogs(label, filterParams || {}, function (err, logs) {
    if (err) return callback(err);
    if (logs && logs.length) logs = logs.reverse();
    callback(null, processLogs(label, aux.index, logs, aux.extraField, aux.mergedLogs));
  });
}

module.exports = getLogs;
