#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var getPrivateKey = require("./lib/get-private-key");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");
var createOrder = require("./lib/create-order");

var keystoreFilePath = process.argv[2];
var marketID = process.argv[3];
var orderType = process.argv[4];
var outcome = process.argv[5];
var shares = process.argv[6];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);
console.log(chalk.red.dim("marketID " + marketID));
console.log(chalk.red.dim("orderType " + orderType));
console.log(chalk.red.dim("outcome " + outcome));
console.log(chalk.red.dim("shares " + shares));

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    console.log(chalk.cyan.dim("networkID:"), chalk.cyan(augur.rpc.getNetworkID()));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) return console.error(err);
      augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
        async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
          var order = {price: marketInfo.maxPrice / 2, shares: shares };
          createOrder(augur, marketID, parseInt(outcome, 10), marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, orderType, order, auth, function (err) {
            if (err) console.error("create-orders failed:", err);
            nextMarket();
          });
        });
      });
    });
  });
});
