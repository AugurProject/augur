#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var createMarket = require("./lib/create-market");
var createOrderBook = require("./lib/create-order-book");
var getPrivateKey = require("./lib/get-private-key");
var getBalances = require("./lib/get-balances");
var cannedMarketsData = require("./data/canned-markets");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var keystoreFilePath = process.argv[2];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error("connect failed:", err);
    var networkID = augur.rpc.getNetworkID();
    var universe = augur.contracts.addresses[networkID].Universe;
    if (debugOptions.cannedMarkets) {
      console.log(chalk.cyan("Network"), chalk.green(networkID));
      console.log(chalk.cyan("Account"), chalk.green(auth.address));
    }
    getBalances(augur, universe, auth.address, function (err, balances) {
      if (err) return console.error("getBalances failed:", err);
      if (debugOptions.cannedMarkets) {
        console.log(chalk.cyan("Balances:"));
        console.log("Ether:      " + chalk.green(balances.ether));
        console.log("Reputation: " + chalk.green(balances.reputation));
      }
      approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
        if (err) return console.error("approveAugurEternalApprovalValue failed:", err);
        console.log(chalk.cyan("Creating canned markets..."));
        async.eachLimit(cannedMarketsData, augur.constants.PARALLEL_LIMIT, function (market, nextMarket) {
          createMarket(augur, market, auth.address, auth, function (err, marketID) {
            if (err) return nextMarket(err);
            console.log(chalk.green(marketID), chalk.cyan.dim(market._description));
            if (process.env.NO_CREATE_ORDERS) return nextMarket();
            var numOutcomes = Array.isArray(market._outcomes) ? market._outcomes.length : 2;
            var numTicks;
            if (market.marketType === "scalar") {
              numTicks = new BigNumber(market._maxPrice, 10).minus(new BigNumber(market._minPrice, 10)).dividedBy(new BigNumber(market.tickSize, 10)).toNumber();
            } else {
              numTicks = augur.constants.DEFAULT_NUM_TICKS[numOutcomes];
            }
            createOrderBook(augur, marketID, numOutcomes, market._maxPrice || "1", market._minPrice || "0", numTicks, market.orderBook, auth, nextMarket);
          });
        }, function (err) {
          if (err) {
            console.error(chalk.red.bold("Canned market creation failed:"), err);
            process.exit(1);
          }
          process.exit();
        });
      });
    });
  });
});
