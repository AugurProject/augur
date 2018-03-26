#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var fillOrder = require("../dp/lib/fill-order");

function fillMarketOrderInternal(augur, marketIds, orderType, outcomeId, universe, auth, callback) {
  augur.markets.getMarkets({ universe: universe, sortBy: "endDate", isSortDescending: true }, function (err, marketIds) {
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
      console.log(chalk.yellow.dim("outcome:"), chalk.yellow(outcomeId), chalk.yellow.dim("order type:"), chalk.yellow(orderType));
      console.log(chalk.green.dim("OrderId:"), chalk.green.dim("Account:"), chalk.green.dim("Amount:"), chalk.green.dim("FullPrecisionPrice:"), chalk.green.dim("FullPrecisionAmount"));
      augur.trading.getOrders({ marketId: marketId, outcome: outcomeId, orderType: orderType }, function (err, orderBook) {
        if (err) {
          console.error(err);
          callback(err);
        }
        if (!orderBook[marketId]) {
          callback("No Market Orders Found");
        }
        var orders = orderBook[marketId][outcomeId][orderType];
        async.eachSeries(Object.keys(orders), function (orderId, nextOrder) {
          var order = orders[orderId];
          console.log(chalk.yellow(order.fullPrecisionPrice), chalk.yellow(order.fullPrecisionAmount));
          fillOrder(augur, universe, auth.address, outcomeId, order.fullPrecisionAmount, orderType, auth, function (err) {
            if (err) {
              nextOrder(err);
            }
            console.log(chalk.green("Success"));
            nextOrder(null);
          });
        }, function (err) {
          callback(err);
        });
      });
    });
  });

}

function help(callback) {
  console.log(chalk.red("params syntax --> marketId"));
  console.log(chalk.red("params syntax --> outcome ( 0, 1, ... )"));
  console.log(chalk.red("params syntax --> order type (buy | sell)"));
  console.log(chalk.yellow("script will approve account"));
  callback(null);
}

function fillMarketOrder(augur, params, auth, callback) {
  console.log("params", params);
  if (params === "help") {
    help(callback);
  } else {
    if (params == null) return callback("MarketId is required");
    var paramArray = params.split(",");
    var marketId = paramArray[0];
    var outcomeId = paramArray[1];
    var orderType = paramArray[2];

    console.log(chalk.yellow.dim("marketId"), chalk.yellow(marketId));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.yellow.dim("Universe"), chalk.yellow(universe));
    fillMarketOrderInternal(augur, [marketId], orderType, outcomeId, universe, auth, callback);
  }
}

module.exports = fillMarketOrder;
