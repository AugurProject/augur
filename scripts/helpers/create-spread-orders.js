#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("../canned-markets/lib/approve-augur-eternal-approval-value");
var getPrivateKey = require("../canned-markets/lib/get-private-key");
var connectionEndpoints = require("../connection-endpoints");
var createOrder = require("../canned-markets/lib/create-order");

var marketID = process.argv[2];

var augur = new Augur();

getPrivateKey(null, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    console.log(chalk.cyan.dim("networkID:"), chalk.cyan(augur.rpc.getNetworkID()));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) return console.error("Could not approve ...", err);
      augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
        if (err) return console.error("Could not get markets Info", err);
        if (!marketsInfo || marketsInfo.length === 0) return console.error("Market not found");
        var marketInfo = marketsInfo[0];
        if (!marketInfo) return console.error("Could not get markets Info", err);
        console.log(chalk.yellow.dim("Market:"), chalk.yellow(marketInfo.id));
        console.log(chalk.yellow.dim("outcomes:"), chalk.yellow(marketInfo.numOutcomes));
        // each outcome create buy and sell open orders
        for (var i = 0; i < marketInfo.numOutcomes; i++) {
          var priceInc = (marketInfo.maxPrice - marketInfo.minPrice) / 10;
          var price = marketInfo.minPrice === 0 ? marketInfo.minPrice + priceInc : marketInfo.minPrice;
          console.log(chalk.yellow.dim("outcome:"), chalk.yellow(i));
          console.log(chalk.yellow.dim("max price:"), chalk.yellow(marketInfo.maxPrice));
          console.log(chalk.yellow.dim("min price:"), chalk.yellow(marketInfo.minPrice));
          while (price < marketInfo.maxPrice) {
            var order = {price: price, shares: 10 };
            console.log(chalk.yellow.dim("order:"), chalk.yellow(JSON.stringify(order)));
            createOrder(augur, marketID, parseInt(i, 10), marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, "buy", order, auth, function (err, res) {
              if (err) console.error("create-orders failed:", err);
              console.log(chalk.green.dim("Order Created"), chalk.green(JSON.stringify(res)));
            });

            createOrder(augur, marketID, parseInt(i, 10), marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, "sell", order, auth, function (err, res) {
              if (err) console.error("create-orders failed:", err);
              console.log(chalk.green.dim("Order Created"), chalk.green(JSON.stringify(res)));
            });
            price += priceInc;
          }
        }
      });
    });
  });
});
