"use strict";

var async = require("async");
var chalk = require("chalk");
var createOrderBook = require("./create-order-book");
var selectCannedMarket = require("./select-canned-market");
var debugOptions = require("../../debug-options");

function createOrders(augur, marketIds, auth, callback) {
  augur.markets.getMarketsInfo({ marketIds: marketIds }, function (err, marketsInfo) {
    if (err) return callback(err);
    async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
      if (debugOptions.cannedMarkets) console.log(chalk.cyan("Creating orders for market"), chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
      if (!marketInfo || !marketInfo.id) {
        console.warn(chalk.yellow.bold("marketInfo not found:"), marketInfo);
        return nextMarket();
      }
      var cannedMarket = selectCannedMarket(marketInfo.description, marketInfo.marketType);
      if (!cannedMarket || !cannedMarket.orderBook) {
        console.warn(chalk.yellow.bold("Canned market data not found for market"), chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
        return nextMarket();
      }
      createOrderBook(augur, marketInfo.id, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, cannedMarket.orderBook, auth, nextMarket);
    }, callback);
  });
}

module.exports = createOrders;
