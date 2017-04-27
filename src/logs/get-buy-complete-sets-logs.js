"use strict";

var clone = require("clone");
var getCompleteSetsLogs = require("./get-complete-sets-logs");

// { account, filter }
function getBuyCompleteSetsLogs(p, callback) {
  var filter;
  filter = p.filter ? clone(p.filter) : {};
  filter.shortAsk = false;
  filter.type = "buy";
  return getCompleteSetsLogs({ account: p.account, filter: p.filter }, callback);
}

module.exports = getBuyCompleteSetsLogs;
