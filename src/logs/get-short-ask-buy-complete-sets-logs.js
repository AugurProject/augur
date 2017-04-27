"use strict";

var clone = require("clone");
var getCompleteSetsLogs = require("./get-complete-sets-logs");

// { account, filter }
function getShortAskBuyCompleteSetsLogs(p, callback) {
  var opt = p.filter ? clone(p.filter) : {};
  opt.shortAsk = true;
  opt.type = "buy";
  return getCompleteSetsLogs({ account: p.account, filter: opt }, callback);
}

module.exports = getShortAskBuyCompleteSetsLogs;
