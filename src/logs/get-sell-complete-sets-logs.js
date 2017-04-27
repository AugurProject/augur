"use strict";

var clone = require("clone");
var getCompleteSetsLogs = require("./get-complete-sets-logs");

// { account, filter }
function getSellCompleteSetsLogs(p, callback) {
  var opt = p.filter ? clone(p.filter) : {};
  opt.shortAsk = false;
  opt.type = "sell";
  return getCompleteSetsLogs({ account: p.account, filter: opt }, callback);
}

module.exports = getSellCompleteSetsLogs;
