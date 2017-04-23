"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var roundToPrecision = require("../../utils/round-to-precision");
var constants = require("../../constants");

function fillOrder(orderID, amount, filledOrderType, orderBook) {
  var newOrderBook, order, updatedAmount;
  if (!orderBook || !orderID || !amount || !filledOrderType) return orderBook;
  if (!orderBook[filledOrderType]) return orderBook;
  if (!orderBook[filledOrderType][orderID]) return orderBook;
  newOrderBook = clone(orderBook);
  order = newOrderBook[filledOrderType][orderID];
  updatedAmount = new BigNumber(order.fullPrecisionAmount, 10).minus(new BigNumber(amount, 10));
  if (updatedAmount.lte(constants.PRECISION.zero)) {
    delete newOrderBook[filledOrderType][orderID];
  } else {
    order.fullPrecisionAmount = updatedAmount.toFixed();
    order.amount = roundToPrecision(updatedAmount, constants.MINIMUM_TRADE_SIZE);
  }
  return newOrderBook;
}

module.exports = fillOrder;
