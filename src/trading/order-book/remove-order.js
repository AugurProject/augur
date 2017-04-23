"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");

function removeOrder(orderID, orderType, orderBook) {
  var newOrderBookSide;
  if (!orderBook || !orderID || !orderType) return orderBook;
  if (!orderBook[orderType]) return orderBook;
  if (!orderBook[orderType][orderID]) return orderBook;
  newOrderBookSide = {};
  newOrderBookSide[orderType] = immutableDelete(orderBook[orderType], orderID);
  return assign({}, orderBook, newOrderBookSide);
}

module.exports = removeOrder;
