"use strict";

var parametrizeOrder = require("./parametrize-order");
var sell = require("./sell");
var noop = require("../../utils/noop");

function placeAsk(p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
  var params;
  if (!callback) callback = noop;
  params = parametrizeOrder(p, market, outcomeID, numShares, limitPrice, tradeGroupID);
  params.onSent = noop;
  params.onSuccess = function () { callback(null); };
  params.onFailed = callback;
  return sell(params);
}

module.exports = placeAsk;
