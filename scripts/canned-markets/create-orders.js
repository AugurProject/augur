#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var createOrderBook = require("./create-order-book");
var cannedMarketsData = require("./markets-data");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(augur, augur.rpc.getCoinbase(), function (err) {
    if (err) return console.error(err);
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    augur.markets.getMarkets({ universe: universe, sortBy: "creationBlockNumber" }, function (err, marketIDs) {
      if (err) return console.error(err);
      augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketsInfo) {
        if (err) return console.error(err);
        async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
          console.log(chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
          var cannedMarket = cannedMarketsData.find(function (cannedMarketData) {
            return cannedMarketData._description === marketInfo.description && cannedMarketData.marketType === marketInfo.type;
          });
          if (!cannedMarket || !cannedMarket.orderBook) return nextMarket();
          createOrderBook(augur, marketInfo.id, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, cannedMarket.orderBook, function (err) {
            if (err) return nextMarket(err);
            nextMarket();
          });
        }, function (err) {
          if (err) console.error("create-orders failed", err);
          process.exit();
        });
      });
    });
  });
});
