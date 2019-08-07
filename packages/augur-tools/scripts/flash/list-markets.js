#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("list all markets with various details"));
  console.log(chalk.red("The details include endTime, description, market Id, ...."));
}

function listMarkets(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green("Universe"), universe);
  augur.api.Augur.getTimestamp(function (err, timestamp) {
    augur.markets.getMarkets({ universe: universe, sortBy: "endTime", isSortDescending: true }, function (err, marketList) {
      if (err) {
        console.log(chalk.red("Error "), chalk.red(err));
        return callback(err);
      }
      if (!marketList.markets || !Array.isArray(marketList.markets) || !marketList.markets.length) {
        return callback("No Market Info");
      }
      marketList.markets.forEach(function (marketInfo) {
        var endTime = marketInfo.endTime;
        var date = new Date(endTime * 1000);
        console.log(chalk.green.dim("ID:"), chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
        console.log(chalk.cyan("endTime:"), chalk.cyan(endTime), chalk.red(date), chalk.white(marketInfo.marketType), chalk.blue(marketInfo.reportingState), chalk.red("DR:"), chalk.red(marketInfo.designatedReporter), "\n");
      });
      displayTime("Current Time", timestamp);
      callback(null);
    });
  });
}

module.exports = listMarkets;
