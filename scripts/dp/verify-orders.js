#!/usr/bin/env node

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var Augur = require("../../src");
var verifyOrderBook = require("./lib/verify-order-book");
var selectCannedMarket = require("./lib/select-canned-market");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  augur.markets.getMarkets({ universe: universe, sortBy: "description" }, function (err, marketIds) {
    if (err) return console.error(err);
    augur.markets.getMarketsInfo({ marketIds: marketIds }, function (err, marketsInfo) {
      if (err) return console.error(err);
      var verifyMarketIds = [];
      var cannedMarkets = [];
      marketsInfo.forEach(function (marketInfo) {
        var description = marketInfo.description;
        var matchingMarketsInfo = marketsInfo.filter(function (market) {
          return market.description === description;
        }).sort(function (marketA, marketB) {
          return new BigNumber(marketB.creationBlock, 10).minus(new BigNumber(marketA.creationBlock, 10)).toNumber();
        });
        var firstMatchingMarketId = matchingMarketsInfo[0].id;
        var cannedMarket = selectCannedMarket(marketInfo.description, marketInfo.marketType);
        if (!cannedMarket || !cannedMarket.orderBook) {
          console.warn(chalk.yellow.bold("Canned market data not found for market"), chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
        } else if (verifyMarketIds.indexOf(firstMatchingMarketId) === -1) {
          verifyMarketIds.push(firstMatchingMarketId);
          cannedMarkets.push(cannedMarket);
        }
      });
      async.forEachOfSeries(verifyMarketIds, function (verifyMarketId, i, nextMarket) {
        verifyOrderBook(augur, verifyMarketId, augur.constants.ORDER_STATE.OPEN, cannedMarkets[i].orderBook, nextMarket);
      }, function (err) {
        if (err) return console.error(err);
        process.exit();
      });
    });
  });
});
