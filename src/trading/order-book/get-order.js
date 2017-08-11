"use strict";

var api = require("../../api");
var parseOrder = require("../../parsers/order");

// { _orderId, _type, _market, _outcome, minPrice, maxPrice }
function getOrder(p, callback) {
  if (p.minPrice == null || p.maxPrice == null) {
    return callback(new Error("Must specify minPrice and maxPrice"));
  }
  api().OrdersFetcher.getOrder({
    _orderId: p._orderId,
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome
  }, function (order) {
    callback(parseOrder(p._type, p.minPrice, p.maxPrice, order));
  });
}

module.exports = getOrder;
