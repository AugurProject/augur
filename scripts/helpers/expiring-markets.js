#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var async = require("async");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  augur.markets.getMarkets({ universe: universe, sortBy: "endDate", isSortDescending: true }, function (err, marketIDs) {
    augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketsInfo) {
      if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) return;
      async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
        var endDate = marketInfo.endDate;
        var date = new Date(endDate * 1000);

        console.log(chalk.cyan("endDate:"), chalk.cyan(endDate), chalk.red(date));
        console.log(chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
        nextMarket();
      });
    });
  });
});
