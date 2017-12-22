"use strict";

var async = require("async");
var chalk = require("chalk");
var createOrderBook = require("./create-order-book");
var cannedMarketsData = require("../data/canned-markets");

function createOrders(augur, marketIDs, auth, callback) {
  augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketsInfo) {
    if (err) return callback(err);
    console.log(chalk.cyan("Creating orders..."));
    async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
      if (!marketInfo || !marketInfo.id) {
        console.log("marketInfo:", marketInfo);
        return nextMarket();
      }
      console.log(chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
      var cannedMarket = cannedMarketsData.find(function (cannedMarketData) {
        return cannedMarketData._description === marketInfo.description && cannedMarketData.marketType === marketInfo.marketType;
      });
      if (!cannedMarket || !cannedMarket.orderBook) return nextMarket();
      createOrderBook(augur, marketInfo.id, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, cannedMarket.orderBook, auth, function (err) {
        if (err) return nextMarket(err);
        nextMarket();
      });
    }, callback);
  });
}

module.exports = createOrders;
