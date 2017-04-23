"use strict";

var parametrizeOrder = require("./parametrize-order");
var sell = require("./sell");
var shortAsk = require("./short-ask");
var noop = require("../../utils/noop");

function placeAskAndShortAsk(market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
  var success, askParams, shortAskParams;
  if (!callback) callback = noop;
  success = { ask: false, shortAsk: false };
  askParams = parametrizeOrder(market, outcomeID, askShares, limitPrice, tradeGroupID);
  shortAskParams = parametrizeOrder(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
  askParams.onSent = noop;
  shortAskParams.onSent = noop;
  askParams.onSuccess = function () {
    success.ask = true;
    if (success.ask && success.shortAsk) callback(null);
  };
  shortAskParams.onSuccess = function () {
    success.shortAsk = true;
    if (success.ask && success.shortAsk) callback(null);
  };
  askParams.onFailed = callback;
  shortAskParams.onFailed = callback;
  sell(askParams);
  shortAsk(shortAskParams);
}

module.exports = placeAskAndShortAsk;
