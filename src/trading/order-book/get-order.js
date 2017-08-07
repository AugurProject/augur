"use strict";

var api = require("../../api");
var parseOrder = require("../../parsers/order");

// { _orderId, _type, _market, _outcome, minPrice, maxPrice }
function getOrder(p, callback) {
  api().OrdersFetcher.getOrder(p, function (order) {
    callback(parseOrder(p._type, p.minPrice, p.maxPrice, order));
  });
}

module.exports = getOrder;
