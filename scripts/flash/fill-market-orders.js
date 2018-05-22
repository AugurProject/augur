#!/usr/bin/env node

"use strict";

var BigNumber = require("bignumber.js");
var async = require("async");
var chalk = require("chalk");
var noop = require("../../src/utils/noop");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");

function help() {
  console.log(chalk.red("Try and fill a market order for order type and outcome"));
  console.log(chalk.red("user will be approved"));
}

function fillMarketOrder(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  var orderType = args.opt.orderType;
  var outcome = args.opt.outcome;
  var direction = orderType === "buy" ? 1 : 0;
  augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketInfos) {
    if (err) {
      console.log(chalk.red("Error "), chalk.red(err));
      return callback(err);
    }
    if (!marketInfos || !Array.isArray(marketInfos) || !marketInfos.length) {
      return callback("No Market Info");
    }
    console.log(chalk.yellow("Approving account"), chalk.yellow(auth.address));
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) {
        console.log(chalk.red("Error "), chalk.red(err));
        return callback(err);
      }
      var market = marketInfos[0];
      var marketId = market.id;
      console.log(chalk.yellow.dim("user"), chalk.yellow(auth.address));
      console.log(chalk.yellow.dim("outcome:"), chalk.yellow(outcome), chalk.yellow.dim("order type:"), chalk.yellow(orderType));
      console.log(chalk.green.dim("OrderId:"), chalk.green.dim("Account:"), chalk.green.dim("Amount:"), chalk.green.dim("FullPrecisionPrice:"), chalk.green.dim("FullPrecisionAmount"));
      augur.trading.getOrders({ marketId: marketId, outcome: outcome, orderType: orderType }, function (err, orderBook) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        if (!orderBook[marketId]) {
          return callback("No Market Orders Found");
        }
        var orders = orderBook[marketId][outcome][orderType];
        // Right now orders are in a random order
        // sort by price ascending
        var sortedOrders = Object.values(orders).sort(function (a, b) {
          return new BigNumber(a.price).comparedTo(new BigNumber(b.price));
        });
        async.eachSeries(sortedOrders, function (order, nextOrder) {
          console.log(chalk.yellow(order.fullPrecisionPrice), chalk.yellow(order.fullPrecisionAmount));

          augur.trading.placeTrade({
            meta: auth,
            amount: order.fullPrecisionAmount,
            limitPrice: order.fullPrecisionPrice,
            numTicks: market.numTicks,
            minPrice: market.minPrice,
            maxPrice: market.maxPrice,
            sharesProvided: "0",
            _direction: direction,
            _market: marketId,
            _outcome: outcome,
            _tradeGroupId: augur.trading.generateTradeGroupId(),
            doNotCreateOrders: true,
            onSent: noop,
            onSuccess: function (tradeAmountRemaining) {
              console.log(chalk.cyan("Trade completed,"), chalk.red.bold(orderType), chalk.green(tradeAmountRemaining), chalk.cyan.dim("shares remaining"));
              nextOrder(null);
            },
            onFailed: function (err) {
              console.log(chalk.red(err));
              nextOrder(err);
            },
          });
        }, function (err) {
          callback(err);
        });
      });
    });
  });
}

module.exports = fillMarketOrder;
