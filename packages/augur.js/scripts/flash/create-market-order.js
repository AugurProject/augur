#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var noop = require("../../src/utils/noop");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");

function help() {
  console.log(chalk.red("Try and fill a market order for order type and outcome"));
  console.log(chalk.red("user will be approved"));
}

function createMarketOrder(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  var orderType = args.opt.orderType;
  var outcome = args.opt.outcome;
  var direction = orderType === "buy" ? 1 : 0;
  var price = args.opt.price;
  var useShares = args.opt.useShares;
  var amount = args.opt.amount;
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
      console.log(chalk.green.dim("price:"), chalk.green(price), chalk.green.dim("Shares"), chalk.green(amount), chalk.green("Use Shares"), chalk.green(useShares ? true : false));

      augur.trading.placeTrade({
        meta: auth,
        amount: amount,
        limitPrice: price,
        numTicks: market.numTicks,
        minPrice: market.minPrice,
        maxPrice: market.maxPrice,
        sharesProvided: useShares ? amount : "0",
        _direction: direction,
        _market: marketId,
        _outcome: outcome,
        _tradeGroupId: augur.trading.generateTradeGroupId(),
        doNotCreateOrders: false,
        onSent: noop,
        onSuccess: function (tradeAmountRemaining) {
          console.log(chalk.cyan("order completed,"), chalk.red.bold(orderType), chalk.green(tradeAmountRemaining), chalk.cyan.dim("shares remaining"));
          callback(null);
        },
        onFailed: function (err) {
          console.log(chalk.red(err));
          callback(err);
        },
      });
    });
  });
}

module.exports = createMarketOrder;
