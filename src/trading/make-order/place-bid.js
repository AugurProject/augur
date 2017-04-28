"use strict";

var parametrizeOrder = require("./parametrize-order");
var buy = require("./buy");
var noop = require("../../utils/noop");

function placeBid(p, market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
  var params;
  if (!callback) callback = noop;
  params = parametrizeOrder(p, market, outcomeID, numShares, limitPrice, tradeGroupID);
  params.onSent = noop;
  params.onSuccess = function () { callback(null); };
  params.onFailed = callback;
  return buy(params);
}

module.exports = placeBid;
