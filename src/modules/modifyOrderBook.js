"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var constants = require("../constants");

module.exports = {

  addOrder: function (order, orderBook) {
    if (!order) return orderBook;
    var newOrderBook = clone(orderBook);
    if (!newOrderBook) newOrderBook = {buy: {}, sell: {}};
    if (!newOrderBook.buy) newOrderBook.buy = {};
    if (!newOrderBook.sell) newOrderBook.sell = {};
    newOrderBook[order.type][order.id] = order;
    return newOrderBook;
  },

  removeOrder: function (orderID, orderType, orderBook) {
    if (!orderBook || !orderID || !orderType) return orderBook;
    if (orderBook[orderType] && orderBook[orderType][orderID]) {
      delete orderBook[orderType][orderID];
    }
    return orderBook;
  },

  fillOrder: function (orderID, amount, filledOrderType, orderBook) {
    if (!orderBook || !orderID || !amount || !filledOrderType) return orderBook;
    var newOrderBook = clone(orderBook);
    if (newOrderBook[filledOrderType]) {
      var order = newOrderBook[filledOrderType][orderID];
      if (order) {
        var updatedAmount = new BigNumber(order.fullPrecisionAmount, 10).minus(new BigNumber(amount, 10));
        if (updatedAmount.lte(constants.PRECISION.zero)) {
          delete newOrderBook[filledOrderType][orderID];
        } else {
          order.fullPrecisionAmount = updatedAmount.toFixed();
          order.amount = this.roundToPrecision(updatedAmount, constants.MINIMUM_TRADE_SIZE);
        }
      }
    }
    return newOrderBook;
  },

  adjustScalarOrder: function (order, minValue) {
    order.fullPrecisionPrice = this.expandScalarPrice(minValue, order.fullPrecisionPrice || order.price);
    order.price = this.expandScalarPrice(minValue, order.price);
    return order;
  },

  // note: minValue required only for scalar markets
  convertAddTxLogToOrder: function (log, marketType, minValue) {
    var round;
    var roundingMode;
    if (log.type === "buy") {
      round = "floor";
      roundingMode = BigNumber.ROUND_DOWN;
    } else {
      round = "ceil";
      roundingMode = BigNumber.ROUND_UP;
    }
    var adjustedLog = marketType === "scalar" ? this.adjustScalarOrder(clone(log), minValue) : clone(log);
    return {
      id: adjustedLog.tradeid,
      type: adjustedLog.type,
      market: adjustedLog.market,
      amount: this.roundToPrecision(new BigNumber(adjustedLog.amount, 10), constants.MINIMUM_TRADE_SIZE),
      fullPrecisionAmount: adjustedLog.amount,
      price: this.roundToPrecision(new BigNumber(adjustedLog.price, 10), constants.PRECISION.zero, round, roundingMode),
      fullPrecisionPrice: adjustedLog.price,
      owner: adjustedLog.sender,
      block: adjustedLog.blockNumber,
      outcome: adjustedLog.outcome.toString()
    };
  }
};
