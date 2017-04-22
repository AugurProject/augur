"use strict";

var BigNumber = require("bignumber.js");
var parseTradeInfo = require("./trade-info");
var adjustScalarOrder = require("../modules/modifyOrderBook").adjustScalarOrder;

module.exports = function (orderArray, scalarMinMax) {
  var minValue, order, isScalar, numOrders, orderBook, i;
  if (!orderArray || orderArray.error) return orderArray;
  isScalar = scalarMinMax && scalarMinMax.minValue !== undefined && scalarMinMax.maxValue !== undefined;
  if (isScalar) minValue = new BigNumber(scalarMinMax.minValue, 10);
  numOrders = orderArray.length / 8;
  orderBook = { buy: {}, sell: {} };
  for (i = 0; i < numOrders; ++i) {
    order = parseTradeInfo(orderArray.slice(8*i, 8*(i + 1)));
    if (order) {
      if (isScalar) order = adjustScalarOrder(order, minValue);
      orderBook[order.type][order.id] = order;
    }
  }
  return orderBook;
};
