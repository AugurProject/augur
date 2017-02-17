"use strict";

var parametrizeOrder = require('./parametrizeOrder');
var utils = require("../utilities");

module.exports = {

  placeBid: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function (res) {
      callback(null);
    };
    params.onFailed = callback;
    return this.buy(params);
  },

  placeAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function (res) {
      callback(null);
    };
    params.onFailed = callback;
    return this.sell(params);
  },

  placeShortAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = utils.noop;
    params.onSuccess = function (res) {
      callback(null);
    };
    params.onFailed = callback;
    return this.shortAsk(params);
  },

  placeAskAndShortAsk: function (market, outcomeID, askShares, shortAskShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var success = {ask: false, shortAsk: false};
    var askParams = parametrizeOrder.parametrizeOrder(market, outcomeID, askShares, limitPrice, tradeGroupID);
    var shortAskParams = parametrizeOrder.parametrizeOrder(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
    askParams.onSent = utils.noop;
    shortAskParams.onSent = utils.noop;
    askParams.onSuccess = function (res) {
      success.ask = true;
      if (success.ask && success.shortAsk) callback(null);
    };
    shortAskParams.onSuccess = function (res) {
      success.shortAsk = true;
      if (success.ask && success.shortAsk) callback(null);
    };
    askParams.onFailed = callback;
    shortAskParams.onFailed = callback;
    this.sell(askParams);
    this.shortAsk(shortAskParams);
  }

};
