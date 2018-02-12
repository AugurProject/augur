#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function displayProperty(key, collection) {
  console.log(chalk.cyan(key), chalk.yellow(collection[key]));
}

function marketInfoInternal(augur, marketID, universe, callback) {
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    displayTime("Current Time", timestamp);
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketInfos) {
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
      Object.keys(marketInfo).forEach(function (key) {
        var item = marketInfo[key];
        if (item) {
          console.log(typeof(item));
          if (typeof(item) !== "object") {
            displayProperty(key, marketInfo);
          } else {
            console.log(chalk.cyan(key));
            Object.keys(item).forEach(function (itemKey) {
              displayProperty(itemKey, item);
            });
          }
        }
      });
      callback(null);
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> -p marketID"));
  callback(null);
}

function marketInfo(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    var marketID = params;
    console.log(chalk.yellow.dim("marketID"), marketID);
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("Universe"), universe);
    marketInfoInternal(augur, marketID, universe, callback);
  }
}

module.exports = marketInfo;
