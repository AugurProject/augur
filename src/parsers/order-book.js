"use strict";

var parseOrder = require("./order");

module.exports = function (type, minPrice, maxPrice, orderBookArray) {
  if (!Array.isArray(orderBookArray) || orderBookArray.error) {
    return orderBookArray;
  }
  var numOrders = orderBookArray.length / 9;
  var orderBook = {};
  for (var i = 0; i < numOrders; ++i) {
    var orderArray = orderBookArray.slice(9*i, 9*(i + 1));
    var order = parseOrder(type, minPrice, maxPrice, orderArray.slice(1));
    if (order != null) orderBook[orderArray[0]] = order;
  }
  return orderBook;
};
