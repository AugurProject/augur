"use strict";

var clone = require("clone");
var getShortSellLogs = require("./get-short-sell-logs");

// { account, filter }
function getTakerShortSellLogs(p, callback) {
  var params = clone(p.filter || {});
  params.maker = false;
  return getShortSellLogs({ account: p.account, filter: params }, callback);
}

module.exports = getTakerShortSellLogs;
