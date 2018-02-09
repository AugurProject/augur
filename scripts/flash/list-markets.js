#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var async = require("async");

function listMarketsInternal(augur, universe) {
  var timestamp = augur.api.Controller.getTimestamp();
  var currentTime = new Date(timestamp * 1000);
  augur.markets.getMarkets({ universe: universe, sortBy: "endDate", isSortDescending: true }, function (err, marketIDs) {
    if (!marketIDs || marketIDs.length === 0) { console.log(chalk.red("No markets available")); process.exit(0);}
    augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketInfos) {
      if (!marketInfos || !Array.isArray(marketInfos) || !marketInfos.length) return;
      var infos = marketInfos.sort(function (a, b) { return b.endDate - a.endDate; });
      async.eachSeries(infos, function (marketInfo, nextMarket) {
        var endDate = marketInfo.endDate;
        var date = new Date(endDate * 1000);
        var ended = date - currentTime > 0 ? "NO" : "YES";
        console.log(chalk.cyan("endDate:"), chalk.cyan(endDate), chalk.red(date), ended ? chalk.yellow(ended) : chalk.red(ended), chalk.blue(marketInfo.reportingState), chalk.red(marketInfo.designatedReporter));
        console.log(chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
        nextMarket();
      }, function () {
        console.log(chalk.blue(timestamp), chalk.red.dim("current time: "), chalk.red(currentTime));
        process.exit(0);
      });
    });
  });
}

function listMarkets(augur, params, callback) {
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("Universe"), universe);
  listMarketsInternal(augur, universe, callback);
}

module.exports = listMarkets;
