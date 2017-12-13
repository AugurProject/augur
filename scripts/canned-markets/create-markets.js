#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var createMarket = require("./lib/create-market");
var createOrders = require("./lib/create-orders");
var cannedMarketsData = require("./data/canned-markets");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(augur, augur.rpc.getCoinbase(), function (err) {
    if (err) return console.error(err);
    console.log(chalk.cyan("Creating canned markets..."));
    var newMarketIDs = [];
    async.eachLimit(cannedMarketsData, augur.constants.PARALLEL_LIMIT, function (market, nextMarket) {
      createMarket(augur, market, function (err, marketID) {
        if (err) return nextMarket(err);
        console.log(chalk.green(marketID), chalk.cyan.dim(market._description));
        newMarketIDs.push(marketID);
        nextMarket();
      });
    }, function (err) {
      if (err) {
        console.error(chalk.red.bold("Canned market creation failed:"), err);
        process.exit(1);
      }
      createOrders(augur, newMarketIDs, function (err) {
        if (err) console.error(chalk.red.bold("Order book creation failed:"), err);
        process.exit();
      });
    });
  });
});
