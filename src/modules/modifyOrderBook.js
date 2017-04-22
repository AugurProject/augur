"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abacus = require("./abacus");
var roundToPrecision = require("../utils/round-to-precision");
var constants = require("../constants");

module.exports = {

  addOrder: function (order, orderBook) {
    var newOrderBook;
    if (!order) return orderBook;
    newOrderBook = clone(orderBook);
    if (!newOrderBook) newOrderBook = {buy: {}, sell: {}};
    if (!newOrderBook.buy) newOrderBook.buy = {};
    if (!newOrderBook.sell) newOrderBook.sell = {};
    newOrderBook[order.type][order.id] = order;
    return newOrderBook;
  },

  removeOrder: function (orderID, orderType, orderBook) {
    var newOrderBook;
    if (!orderBook || !orderID || !orderType) return orderBook;
    newOrderBook = clone(orderBook);
    if (newOrderBook[orderType] && newOrderBook[orderType][orderID]) {
      delete newOrderBook[orderType][orderID];
    }
    return newOrderBook;
  },

  fillOrder: function (orderID, amount, filledOrderType, orderBook) {
    var newOrderBook, order, updatedAmount;
    if (!orderBook || !orderID || !amount || !filledOrderType) return orderBook;
    newOrderBook = clone(orderBook);
    if (newOrderBook[filledOrderType]) {
      order = newOrderBook[filledOrderType][orderID];
      if (this.options.debug.trading) {
        console.log("found order:", order);
      }
      if (order) {
        updatedAmount = new BigNumber(order.fullPrecisionAmount, 10).minus(new BigNumber(amount, 10));
        if (this.options.debug.trading) {
          console.log("updated amount:", updatedAmount.toFixed());
        }
        if (updatedAmount.lte(constants.PRECISION.zero)) {
          if (this.options.debug.trading) {
            console.log("removing order");
          }
          delete newOrderBook[filledOrderType][orderID];
        } else {
          order.fullPrecisionAmount = updatedAmount.toFixed();
          order.amount = roundToPrecision(updatedAmount, constants.MINIMUM_TRADE_SIZE);
          if (this.options.debug.trading) {
            console.log("updated order:", order);
          }
        }
      }
    }
    return newOrderBook;
  },

  adjustScalarOrder: function (order, minValue) {
    var adjustedOrder = clone(order);
    adjustedOrder.fullPrecisionPrice = abacus.expandScalarPrice(minValue, order.fullPrecisionPrice || order.price);
    adjustedOrder.price = abacus.expandScalarPrice(minValue, order.price);
    return adjustedOrder;
  },

  // note: minValue required only for scalar markets
  convertAddTxLogToOrder: function (log, marketType, minValue) {
    var round, roundingMode, adjustedLog;
    if (log.type === "buy") {
      round = "floor";
      roundingMode = BigNumber.ROUND_DOWN;
    } else {
      round = "ceil";
      roundingMode = BigNumber.ROUND_UP;
    }
    adjustedLog = marketType === "scalar" ? this.adjustScalarOrder(clone(log), minValue) : clone(log);
    return {
      id: adjustedLog.tradeid,
      type: adjustedLog.type,
      market: adjustedLog.market,
      amount: roundToPrecision(new BigNumber(adjustedLog.amount, 10), constants.MINIMUM_TRADE_SIZE),
      fullPrecisionAmount: adjustedLog.amount,
      price: this.roundToPrecision(new BigNumber(adjustedLog.price, 10), constants.PRECISION.zero, round, roundingMode),
      fullPrecisionPrice: adjustedLog.price,
      owner: adjustedLog.sender,
      block: adjustedLog.blockNumber,
      outcome: adjustedLog.outcome.toString()
    };
  }
};
