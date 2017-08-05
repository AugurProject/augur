"use strict";

var parseTradeInfo = require("./trade-info");
var denormalizePrice = require("../trading/denormalize-price");

module.exports = function (orderArray, scalarMinMax) {
  var order, numOrders, orderBook, i;
  if (!orderArray || orderArray.error) return orderArray;
  numOrders = orderArray.length / 8;
  orderBook = { buy: {}, sell: {} };
  for (i = 0; i < numOrders; ++i) {
    order = parseTradeInfo(orderArray.slice(8*i, 8*(i + 1)));
    if (order) {
      order.price = denormalizePrice(scalarMinMax.minValue, scalarMinMax.maxValue, order.price);
      if (order.fullPrecisionPrice) {
        order.fullPrecisionPrice = denormalizePrice(scalarMinMax.minValue, scalarMinMax.maxValue, order.fullPrecisionPrice);
      } else {
        order.fullPrecisionPrice = order.price;
      }
      orderBook[order.type][order.id] = order;
    }
  }
  return orderBook;
};
