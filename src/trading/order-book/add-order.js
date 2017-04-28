"use strict";

var clone = require("clone");

function addOrder(order, orderBook) {
  var newOrderBook;
  if (!order) return orderBook;
  newOrderBook = clone(orderBook);
  if (!newOrderBook) newOrderBook = { buy: {}, sell: {} };
  if (!newOrderBook.buy) newOrderBook.buy = {};
  if (!newOrderBook.sell) newOrderBook.sell = {};
  newOrderBook[order.type][order.id] = order;
  return newOrderBook;
}

module.exports = addOrder;
