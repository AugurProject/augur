#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var getPrivateKey = require("../dp/lib/get-private-key").getPrivateKey;
var claimMarketsTradingProceeds = require("../../src/trading/claim-markets-trading-proceeds");

var marketId = process.argv[2];

var augur = new Augur();

getPrivateKey(null, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);

  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);

    var claimTradingPayload = { markets: [marketId],
      meta: auth,
      _shareHolder: auth.address,
      onSent: function (result) {
        console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
      },
      onSuccess: function (result) {
        console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
        process.exit(0);
      },
      onFailed: function (result) {
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
        process.exit(1);
      },
    };

    console.log(chalk.green.dim("claimTradingPayload:"), chalk.green(JSON.stringify(claimTradingPayload)));
    claimMarketsTradingProceeds(claimTradingPayload);
  });
});

