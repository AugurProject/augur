"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var debugOptions = require("../../debug-options");

function convertDecimalToFixedPoint(decimalValue, conversionFactor) {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).floor().toFixed();
}

function createOrder(augur, marketID, outcome, numOutcomes, maxPrice, minPrice, numTicks, orderType, order, callback) {
  var normalizedPrice = augur.trading.normalizePrice({ price: order.price, maxPrice: maxPrice, minPrice: minPrice });
  var tickSize = (new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10))).dividedBy(new BigNumber(numTicks, 10)).toFixed();
  var bnOnChainShares = new BigNumber(convertDecimalToFixedPoint(order.shares, speedomatic.fix(tickSize, "string")), 10);
  var bnPrice = new BigNumber(convertDecimalToFixedPoint(normalizedPrice, numTicks), 10);
  var orderTypeCode, bnCost;
  if (orderType === "buy") {
    orderTypeCode = 0;
    bnCost = bnOnChainShares.times(bnPrice);
  } else {
    orderTypeCode = 1;
    bnCost = bnOnChainShares.times(new BigNumber(numTicks, 10).minus(bnPrice));
  }
  if (debugOptions.cannedMarkets) console.log("cost:", speedomatic.unfix(bnCost, "string"));
  var params = {
    tx: { value: "0x" + bnCost.toString(16), gas: augur.constants.CREATE_ORDER_GAS },
    _type: orderTypeCode,
    _attoshares: "0x" + bnOnChainShares.toString(16),
    _displayPrice: "0x" + bnPrice.toString(16),
    _market: marketID,
    _outcome: outcome,
    _betterOrderId: 0,
    _worseOrderId: 0,
    _tradeGroupId: 0,
    onSent: function (res) {
      if (debugOptions.cannedMarkets) console.log("publicCreateOrder sent:", order, res.hash);
    },
    onSuccess: function (res) {
      if (debugOptions.cannedMarkets) console.log("publicCreateOrder success:", order, res.callReturn);
      callback(null);
    },
    onFailed: function (err) {
      if (debugOptions.cannedMarkets) console.error("publicCreateOrder failed:", order);
      callback(err);
    },
  };
  if (debugOptions.cannedMarkets) console.log("createOrder params:", params);
  augur.api.CreateOrder.publicCreateOrder(params);
}

function createOrderBook(augur, marketID, numOutcomes, maxPrice, minPrice, numTicks, orderBook, callback) {
  async.forEachOf(orderBook, function (orders, orderType, nextOrderType) {
    if (debugOptions.cannedMarkets) console.log("orderType:", orderType);
    async.forEachOf(orders, function (outcomeOrders, outcome, nextOutcome) {
      if (debugOptions.cannedMarkets) console.log("outcome:", outcome);
      async.each(outcomeOrders, function (order, nextOrder) {
        createOrder(augur, marketID, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, numTicks, orderType, order, nextOrder);
      }, nextOutcome);
    }, nextOrderType);
  }, callback);
}

module.exports = createOrderBook;
