"use strict";

var clone = require("clone");
var getCompleteSetsLogs = require("./get-complete-sets-logs");
var isFunction = require("../utils/is-function");

function getShortAskBuyCompleteSetsLogs(account, options, callback) {
  var opt;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  opt = options ? clone(options) : {};
  opt.shortAsk = true;
  opt.type = "buy";
  return getCompleteSetsLogs(account, opt, callback);
}

module.exports = getShortAskBuyCompleteSetsLogs;
