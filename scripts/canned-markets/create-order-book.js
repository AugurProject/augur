"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var convertDecimalToFixedPoint = require("../../src/utils/convert-decimal-to-fixed-point");
var constants = require("../../src/constants");
var DEBUG = require("./debug-options").cannedMarkets;

function createOrder(augur, marketID, outcome, numOutcomes, maxPrice, minPrice, numTicks, orderType, order, callback) {
  var normalizedPrice = augur.trading.normalizePrice({ price: order.price, maxPrice: maxPrice, minPrice: minPrice });
  var tickSize = (new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10))).dividedBy(new BigNumber(numTicks, 10)).toFixed();
  var bnOnChainShares = new BigNumber(convertDecimalToFixedPoint(order.shares, speedomatic.fix(tickSize, "string")), 16);
  var bnPrice = new BigNumber(convertDecimalToFixedPoint(normalizedPrice, numTicks), 16);
  var orderTypeCode, bnCost;
  if (orderType === "buy") {
    orderTypeCode = 0;
    bnCost = bnOnChainShares.times(bnPrice);
  } else {
    orderTypeCode = 1;
    bnCost = bnOnChainShares.times(new BigNumber(numTicks, 10).minus(bnPrice));
  }
  if (DEBUG) console.log("cost:", speedomatic.unfix(bnCost, "string"));
  var params = {
    tx: { value: "0x" + bnCost.toString(16), gas: constants.CREATE_ORDER_GAS },
    _type: orderTypeCode,
    _attoshares: "0x" + bnOnChainShares.toString(16),
    _displayPrice: "0x" + bnPrice.toString(16),
    _market: marketID,
    _outcome: outcome,
    _betterOrderId: 0,
    _worseOrderId: 0,
    _tradeGroupId: 0,
    onSent: function (res) {
      if (DEBUG) console.log("publicCreateOrder sent:", order, res.hash);
    },
    onSuccess: function (res) {
      if (DEBUG) console.log("publicCreateOrder success:", order, res.callReturn);
      callback(null);
    },
    onFailed: function (err) {
      if (DEBUG) console.error("publicCreateOrder failed:", order);
      callback(err);
    },
  };
  if (DEBUG) console.log("createOrder params:", params);
  augur.api.CreateOrder.publicCreateOrder(params);
}

function createOrderBook(augur, marketID, numOutcomes, maxPrice, minPrice, numTicks, orderBook, callback) {
  async.forEachOf(orderBook, function (orders, orderType, nextOrderType) {
    if (DEBUG) console.log("orderType:", orderType);
    async.forEachOf(orders, function (outcomeOrders, outcome, nextOutcome) {
      if (DEBUG) console.log("outcome:", outcome);
      async.each(outcomeOrders, function (order, nextOrder) {
        createOrder(augur, marketID, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, numTicks, orderType, order, nextOrder);
      }, nextOutcome);
    }, nextOrderType);
  }, callback);
}

module.exports = createOrderBook;
