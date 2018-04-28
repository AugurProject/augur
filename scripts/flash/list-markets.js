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
    var currentTime = new Date(timestamp * 1000);
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
          var ended = date - currentTime > 0 ? "NO" : "YES";
          console.log(chalk.cyan("endTime:"), chalk.cyan(endTime), chalk.red(date), ended ? chalk.yellow(ended) : chalk.red(ended), chalk.white(marketInfo.marketType), chalk.blue(marketInfo.reportingState), chalk.red(marketInfo.designatedReporter));
          console.log(chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
        });
        displayTime("Current Time", timestamp);
        callback(null);
      });
    });
  });
}

module.exports = listMarkets;
