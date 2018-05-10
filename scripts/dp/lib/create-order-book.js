"use strict";

var async = require("async");
var chalk = require("chalk");
var createOrder = require("./create-order");
var debugOptions = require("../../debug-options");

function createOrderBook(augur, marketId, numOutcomes, maxPrice, minPrice, numTicks, orderBook, auth, callback) {
  async.forEachOfLimit(orderBook, augur.constants.PARALLEL_LIMIT, function (orders, orderType, nextOrderType) {
    var tradeGroupId = augur.trading.generateTradeGroupId();
    if (debugOptions.cannedMarkets) console.log(chalk.cyan.dim("Creating"), chalk.cyan(orderType), chalk.cyan.dim("orders - trade group ID"), chalk.green(tradeGroupId));
    async.forEachOfLimit(orders, augur.constants.PARALLEL_LIMIT, function (outcomeOrders, outcome, nextOutcome) {
      if (debugOptions.cannedMarkets) console.log(chalk.cyan.dim("Creating orders for outcome"), chalk.cyan(outcome));
      async.eachLimit(outcomeOrders, augur.constants.PARALLEL_LIMIT, function (order, nextOrder) {
        createOrder(augur, marketId, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, numTicks, orderType, order, tradeGroupId, auth, nextOrder);
      }, nextOutcome);
    }, nextOrderType);
  }, callback);
}

module.exports = createOrderBook;
