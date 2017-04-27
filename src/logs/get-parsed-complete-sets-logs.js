"use strict";

var getCompleteSetsLogs = require("./get-complete-sets-logs");
var parseCompleteSetsLogs = require("./parse-complete-sets-logs");

// { account, filter }
function getParsedCompleteSetsLogs(p, callback) {
  p.filter = p.filter || {};
  getCompleteSetsLogs(p, function (err, logs) {
    if (err) return callback(err);
    callback(null, parseCompleteSetsLogs(logs, p.filter.mergeInto));
  });
}

module.exports = getParsedCompleteSetsLogs;
