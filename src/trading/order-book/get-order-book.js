"use strict";

var api = require("../../api");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");

// scalarMinMax: null if not scalar; {minValue, maxValue} if scalar
// { market, scalarMinMax }
function getOrderBook(p, callback) {
  return api().CompositeGetters.getOrderBook({
    marketID: p.market,
    offset: p.offset || 0,
    numTradesToLoad: p.numTradesToLoad || 0
  }, callback, { extraArgument: p.scalarMinMax });
}

module.exports = getOrderBook;
