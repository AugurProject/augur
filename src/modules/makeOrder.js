"use strict";

var parametrizeOrder = require('./parametrizeOrder');

module.exports = {

  placeBid: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("bid sent:", res); };
    params.onSuccess = function (res) { console.log("bid success:", res); };
    params.onFailed = function (err) { console.error("bid failed:", err); };
    return this.buy(params);
  },

  placeAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("ask sent:", res); };
    params.onSuccess = function (res) { console.log("ask success:", res); };
    params.onFailed = function (err) { console.error("ask failed:", err); };
    return this.sell(params);
  },

  placeShortAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = parametrizeOrder.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("short ask sent:", res); };
    params.onSuccess = function (res) { console.log("short ask success:", res); };
    params.onFailed = function (err) { console.error("short ask failed:", err); };
    return this.shortAsk(params);
  }

};
