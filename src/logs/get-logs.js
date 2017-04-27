"use strict";

var getFilteredLogs = require("./get-filtered-logs");
var processLogs = require("./process-logs");

// { label, filter, aux: {index: str/arr, mergedLogs: {}, extraField: {name, value}} }
function getLogs(p, callback) {
  p.aux = p.aux || {};
  getFilteredLogs(p.label, p.filter || {}, function (err, logs) {
    if (err) return callback(err);
    if (logs && logs.length) logs = logs.reverse();
    callback(null, processLogs(p.label, p.aux.index, logs, p.aux.extraField, p.aux.mergedLogs));
  });
}

module.exports = getLogs;
