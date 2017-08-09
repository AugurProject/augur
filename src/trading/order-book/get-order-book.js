"use strict";

var api = require("../../api");
var parseOrderBook = require("../../parsers/order-book");

// { _type, _market, _outcome, _startingOrderId, _numOrdersToLoad, minPrice, maxPrice }
function getOrderBook(p, callback) {
  api().OrderBook.getOrderBook({
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome,
    _startingOrderId: p._startingOrderId || 0,
    _numOrdersToLoad: p._numOrdersToLoad || 0
  }, function (orderBook) {
    callback(parseOrderBook(p._type, p.minPrice, p.maxPrice, orderBook), orderBook[orderBook.length - 10]);
  });
}

module.exports = getOrderBook;
