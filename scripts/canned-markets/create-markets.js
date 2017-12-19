#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var fs = require("fs");
var async = require("async");
var chalk = require("chalk");
var keythereum = require("keythereum");
var speedomatic = require("speedomatic");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var createMarket = require("./lib/create-market");
var createOrders = require("./lib/create-orders");
var cannedMarketsData = require("./data/canned-markets");
// var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var augur = new Augur();

var keyFilePath = process.argv[2];

augur.rpc.setDebugOptions(debugOptions);

var connectionEndpoints = {
  "ethereumNode": {
    "http": "http://rinkeby.augur.net:8545",
    "ws": "ws://rinkeby.augur.net:8546",
  },
  "augurNode": "ws://127.0.0.1:9001",
};

fs.readFile(keyFilePath, function (err, keystoreJson) {
  if (err) throw err;
  var keystore = JSON.parse(keystoreJson);
  var sender = speedomatic.formatEthereumAddress(keystore.address);
  console.log("sender:", sender);
  keythereum.recover(process.env.GETH_PASSWORD, keystore, function (privateKey) {
    if (privateKey == null || privateKey.error) throw new Error("private key decryption failed");
    var auth = { privateKeyOrSigner: privateKey, accountType: "privateKey" };
    console.log("auth:", auth);
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
  });
});
