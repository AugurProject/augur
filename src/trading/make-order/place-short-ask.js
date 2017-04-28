"use strict";

var parametrizeOrder = require("./parametrize-order");
var shortAsk = require("./short-ask");
var noop = require("../../utils/noop");

function placeShortAsk(p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
  var params;
  if (!callback) callback = noop;
  params = parametrizeOrder(p, market, outcomeID, numShares, limitPrice, tradeGroupID);
  params.onSent = noop;
  params.onSuccess = function () { callback(null); };
  params.onFailed = callback;
  return shortAsk(params);
}

module.exports = placeShortAsk;
