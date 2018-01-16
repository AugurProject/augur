#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var BigNumber = require("bignumber.js");

var marketID = process.argv[2];
var outcome = process.argv[3];
var invalid = process.argv[4];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  if (!invalid) invalid = false;
  augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
    var market = marketsInfo[0];
    var numTicks = market.numTicks;
    var payoutNumerators = Array(market.numOutcomes).fill(new BigNumber(0, 10));
    payoutNumerators[outcome] = new BigNumber(numTicks, 10);


    var reportPayload = { tx: { to: marketID  },
      _payoutNumerators: payoutNumerators,
      _invalid: invalid,
      onSent: function (result) {
        console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
      },
      onSuccess: function (result) {
        console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
        process.exit(1);
      },
      onFailed: function (result) {
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
        process.exit(0);
      },
    };

    console.log(chalk.green.dim("reportPayload:"), chalk.green(JSON.stringify(reportPayload)));
    augur.api.Market.doInitialReport(reportPayload);
  });
});

