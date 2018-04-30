#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");
var getPrivateKey = require("../dp/lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var marketId = process.argv[2];
var orderType = process.argv[3];
var outcome = process.argv[4];
var shares = process.argv[5];
var price = process.argv[6];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);
console.log(chalk.red.dim("marketId " + marketId));
console.log(chalk.red.dim("orderType " + orderType));
console.log(chalk.red.dim("outcome " + outcome));
console.log(chalk.red.dim("shares " + shares));
console.log(chalk.red.dim("price " + price));

getPrivateKey(null, function (err, auth) {
  if (err) {
    console.error("getPrivateKey failed:", err);
    process.exit(1);
  }
  augur.connect(connectionEndpoints, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      var direction = orderType === "buy" ? 0 : 1;
      augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
        async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
          console.log(chalk.yellow.dim("max price:"), chalk.yellow(marketInfo.maxPrice));
          console.log(chalk.yellow.dim("min price:"), chalk.yellow(marketInfo.minPrice));
          console.log(chalk.yellow.dim("outcomes:"), chalk.yellow(marketInfo.outcomes));
          if (!price) { console.error("price needs to be set"); nextMarket(); }
          if (!shares) { console.error("shares needs to be set"); nextMarket(); }
          var tradeGroupId = augur.trading.generateTradeGroupId();
          var placeTradePayload = {
            meta: auth,
            amount: shares,
            limitPrice: price,
            minPrice: marketInfo.minPrice,
            maxPrice: marketInfo.maxPrice,
            numTicks: marketInfo.numTicks,
            _direction: direction,
            _market: marketId,
            _outcome: outcome,
            _tradeGroupId: tradeGroupId,
            doNotCreateOrders: false,
            onSent: function (res) {
              if (debugOptions.cannedMarkets) console.log(chalk.green.dim("placeTrade sent:"), res.hash);
            },
            onSuccess: function () { nextMarket(null); },
            onFailed: function (err) {
              nextMarket(err);
            },
          };
          if (debugOptions.cannedMarkets) console.log("create-order placeTradePayload:", placeTradePayload);

          augur.trading.placeTrade(placeTradePayload);

        }, function (err) {
          if (err) console.log(chalk.red(err));
          process.exit(0);
        });
      });
    });
  });
});
