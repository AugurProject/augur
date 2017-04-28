"use strict";

var async = require("async");
var generateOrdersForOutcome = require("./generate-orders-for-outcome");
var getOrderBook = require("../../trading/order-book/get-order-book");
var PARALLEL_LIMIT = require("../../constants").PARALLEL_LIMIT;

function generateOrders(market, outcomes, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
  async.forEachOfLimit(outcomes, PARALLEL_LIMIT, function (outcome, index, nextOutcome) {
    generateOrdersForOutcome(index, market, outcome, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, nextOutcome);
  }, function (err) {
    if (err) return onFailed(err);
    getOrderBook(market, scalarMinMax, onSuccess);
  });
}

module.exports = generateOrders;
