"use strict";

var async = require("async");
var chalk = require("chalk");
var createOrder = require("./create-order");
var debugOptions = require("../../debug-options");

function createOrderBook(augur, marketID, numOutcomes, maxPrice, minPrice, numTicks, orderBook, auth, callback) {
  async.forEachOf(orderBook, function (orders, orderType, nextOrderType) {
    if (debugOptions.cannedMarkets) console.log(chalk.cyan.dim("orderType:"), chalk.cyan(orderType));
    async.forEachOf(orders, function (outcomeOrders, outcome, nextOutcome) {
      if (debugOptions.cannedMarkets) console.log(chalk.cyan.dim("outcome:"), chalk.cyan(outcome));
      async.each(outcomeOrders, function (order, nextOrder) {
        createOrder(augur, marketID, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, numTicks, orderType, order, auth, nextOrder);
      }, nextOutcome);
    }, nextOrderType);
  }, callback);
}

module.exports = createOrderBook;
