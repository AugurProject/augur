"use strict";

var parametrizeOrder = require('./parametrizeOrder');

module.exports = {

  placeBid: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("bid sent:", res); };
    params.onSuccess = function (res) {
      console.log("bid success:", res);
      callback(null);
    };
    params.onFailed = callback;
    return this.buy(params);
  },

  placeAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("ask sent:", res); };
    params.onSuccess = function (res) {
      console.log("ask success:", res);
      callback(null);
    };
    params.onFailed = callback;
    return this.sell(params);
  },

  placeShortAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID, callback) {
    if (!callback) callback = utils.noop;
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("short ask sent:", res); };
    params.onSuccess = function (res) {
      console.log("short ask success:", res);
      callback(null);
    };
    params.onFailed = callback;
    return this.shortAsk(params);
  }

};
