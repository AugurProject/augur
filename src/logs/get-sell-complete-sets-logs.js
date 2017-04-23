"use strict";

var clone = require("clone");
var getCompleteSetsLogs = require("./get-complete-sets-logs");
var isFunction = require("../utils/is-function");

function getSellCompleteSetsLogs(account, options, callback) {
  var opt;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  opt = options ? clone(options) : {};
  opt.shortAsk = false;
  opt.type = "sell";
  return getCompleteSetsLogs(account, opt, callback);
}

module.exports = getSellCompleteSetsLogs;
