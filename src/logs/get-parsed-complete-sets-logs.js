"use strict";

var getCompleteSetsLogs = require("./get-complete-sets-logs");
var parseCompleteSetsLogs = require("./parse-complete-sets-logs");
var isFunction = require("../utils/is-function");

function getParsedCompleteSetsLogs(account, options, callback) {
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  options = options || {};
  getCompleteSetsLogs(account, options, function (err, logs) {
    if (err) return callback(err);
    callback(null, parseCompleteSetsLogs(logs, options.mergeInto));
  });
}

module.exports = getParsedCompleteSetsLogs;
