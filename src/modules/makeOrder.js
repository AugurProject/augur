"use strict";

var parametrizeOrder = require("./parametrizeOrder");
var utils = require("../utilities");

module.exports = {

  placeBid: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    var params;
    if (!callback) callback = utils.noop;
    params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function () {
      callback(null);
    };
    params.onFailed = callback;
    return this.buy(params);
  },

  placeAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    var params;
    if (!callback) callback = utils.noop;
    params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function () {
      callback(null);
    };
    params.onFailed = callback;
    return this.sell(params);
  },

  placeShortAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    var params;
    if (!callback) callback = utils.noop;
    params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function () {
      callback(null);
    };
    params.onFailed = callback;
    return this.shortAsk(params);
  },

  placeAskAndShortAsk: function (market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
    var success, askParams, shortAskParams;
    if (!callback) callback = utils.noop;
    success = {ask: false, shortAsk: false};
    askParams = parametrizeOrder.parametrizeOrder(market, outcomeID, askShares, limitPrice, tradeGroupID);
    shortAskParams = parametrizeOrder.parametrizeOrder(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
    askParams.onSent = utils.noop;
    shortAskParams.onSent = utils.noop;
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
    this.sell(askParams);
    this.shortAsk(shortAskParams);
  }

};
