#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function displayProperty(key, collection) {
  console.log(chalk.cyan(key), chalk.yellow(collection[key]));
}

function help() {
  console.log(chalk.red("Shows properties for a Market"));
}

function marketInfo(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    displayTime("Current Time", timestamp);
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketInfos) {
      if (err) {
        console.log(chalk.red("Error "), chalk.red(err));
        return callback(err);
      }
      if (!marketInfos || !Array.isArray(marketInfos) || marketInfos.length === 0) {
        return callback("No Market Info");
      }
      var marketInfo = marketInfos[0];
      if (marketInfo === null) {
        return callback("Market is null");
      }
      Object.keys(marketInfo).sort().forEach(function (key) {
        var item = marketInfo[key];
        if (item) {
          if (typeof(item) !== "object") {
            displayProperty(key, marketInfo);
          } else {
            console.log(chalk.cyan(key));
            Object.keys(item).forEach(function (itemKey) {
              if (typeof(item) !== "object") {
                displayProperty(itemKey, item);
              } else {
                console.log(chalk.yellow(JSON.stringify(item[itemKey])));
              }
            });
          }
        }
      });
      callback(null);
    });
  });
}

module.exports = marketInfo;
