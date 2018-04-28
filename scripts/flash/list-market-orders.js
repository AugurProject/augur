#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var async = require("async");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("List all orders for this market"));
}

function getMarketOrders(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    if (err) {
      return callback(err);
    }
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketInfos) {
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
}

module.exports = getMarketOrders;
