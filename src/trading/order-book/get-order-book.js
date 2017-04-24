"use strict";

var api = require("../../api");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");

// scalarMinMax: null if not scalar; {minValue, maxValue} if scalar
function getOrderBook(market, scalarMinMax, callback) {
  var offset, numTradesToLoad;
  if (!callback && isFunction(scalarMinMax)) {
    callback = scalarMinMax;
    scalarMinMax = null;
  }
  if (isObject(market)) {
    offset = market.offset;
    numTradesToLoad = market.numTradesToLoad;
    scalarMinMax = scalarMinMax || market.scalarMinMax;
    callback = callback || market.callback;
    market = market.market;
  }
  return api.CompositeGetters.getOrderBook(market, offset || 0, numTradesToLoad || 0, callback, { extraArgument: scalarMinMax });
}

module.exports = getOrderBook;
