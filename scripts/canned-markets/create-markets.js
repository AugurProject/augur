#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var createNewMarket = require("./create-new-market");
var cannedMarketsData = require("./markets-data");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(augur, augur.rpc.getCoinbase(), function (err) {
    if (err) return console.error(err);
    async.eachSeries(cannedMarketsData, function (market, nextMarket) {
      createNewMarket(augur, market, function (err, marketID) {
        if (err) return nextMarket(err);
        console.log(chalk.green(marketID), chalk.cyan.dim(market._description));
        nextMarket();
      });
    }, function (err) {
      if (err) console.error("canned market creation failed:", err);
      process.exit();
    });
  });
});
