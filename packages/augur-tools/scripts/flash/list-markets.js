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
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    augur.markets.getMarkets({ universe: universe, sortBy: "endTime", isSortDescending: true }, function (err, marketIds) {
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
        var infos = marketInfos.sort(function (a, b) { return b.endTime - a.endTime; });
        infos.forEach(function (marketInfo) {
          var endTime = marketInfo.endTime;
          var date = new Date(endTime * 1000);
          console.log(chalk.green.dim("ID:"), chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
          console.log(chalk.cyan("endTime:"), chalk.cyan(endTime), chalk.red(date), chalk.white(marketInfo.marketType), chalk.blue(marketInfo.reportingState), chalk.red("DR:"), chalk.red(marketInfo.designatedReporter), "\n");
        });
        displayTime("Current Time", timestamp);
        callback(null);
      });
    });
  });
}

module.exports = listMarkets;
