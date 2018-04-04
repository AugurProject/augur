#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var async = require("async");
var displayTime = require("./display-time");

function getMarketOrdersInternal(augur, marketIds, universe, auth, callback) {
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    if (err) {
      return callback(err);
    }
    augur.markets.getMarkets({ universe: universe, sortBy: "endTime", isSortDescending: true }, function (err, marketIds) {
      if (err) {
        return callback(err);
      }
      if (!marketIds || marketIds.length === 0) {
        console.log(chalk.red("No markets available"));
        callback("No Markets");
      }
      augur.markets.getMarketsInfo({ marketIds: marketIds }, function (err, marketInfos) {
        if (err) {
          console.log(chalk.red("Error "), chalk.red(err));
          return callback(err);
        }
        if (!marketInfos || !Array.isArray(marketInfos) || !marketInfos.length) {
          return callback("No Market Info");
        }
        var market = marketInfos[0];
        var marketId = market.id;
        var outcomes = Array.from(Array(market.numOutcomes).keys());

        var orderTypes = ["buy", "sell"];
        async.eachSeries(outcomes, function (outcomeId, nextOutcome) {
          async.eachSeries(orderTypes, function (orderType, nextOrderType) {
            console.log(chalk.yellow.dim("outcome:"), chalk.yellow(outcomeId), chalk.yellow.dim("order type:"), chalk.yellow(orderType));
            console.log(chalk.green.dim("OrderId:"), chalk.green.dim("Account:"), chalk.green.dim("Amount:"), chalk.green.dim("FullPrecisionPrice:"), chalk.green.dim("FullPrecisionAmount"));
            augur.trading.getOrders({ marketId: marketId, outcome: outcomeId, orderType: orderType }, function (err, orderBook) {
              if (err) {
                console.error(err);
                return nextOrderType(err);
              }

              if (!orderBook[marketId]) {
                console.log("No Market Orders Found");
                return nextOrderType(null);
              }
              if (!orderBook[marketId][outcomeId]) {
                console.log("No Market Orders for outcome", outcomeId);
                return nextOrderType(null);
              }
              var orders = orderBook[marketId][outcomeId][orderType];
              Object.keys(orders).forEach(function (orderId) {
                var order = orders[orderId];
                console.log(chalk.green(orderId), chalk.yellow(order.owner), chalk.yellow(order.amount), chalk.yellow(order.fullPrecisionPrice), chalk.yellow(order.fullPrecisionAmount));
              });
              nextOrderType(null);
            });
          }, function (err) {
            if (err) console.log(chalk.red(err));
            nextOutcome();
          });
        }, function () {
          displayTime("Current Time", timestamp);
          callback(null);
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> marketId"));
  callback(null);
}

function getMarketOrders(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    if (params == null) return callback("MarketId is required");
    var marketId = params;
    console.log(chalk.yellow.dim("marketId"), chalk.yellow(marketId));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.yellow.dim("Universe"), chalk.yellow(universe));
    getMarketOrdersInternal(augur, [marketId], universe, auth, callback);
  }
}

module.exports = getMarketOrders;
