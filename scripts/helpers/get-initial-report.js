#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var marketId = process.argv[2];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  if (!marketId) { console.log(chalk.red("marketId is needed")); process.exit(1); }
  augur.api.Market.getInitialReporter({ tx: { to: marketId  }}, function (err, contractId) {
    if (err) console.log(chalk.red.dim("Error:"), chalk.green(JSON.stringify(err)));
    console.log(chalk.green.dim("Initial Reporter Contract address:"), chalk.green(JSON.stringify(contractId)));
    augur.api.InitialReporter.getReportTimestamp({ tx: { to: contractId  }}, function (err, value) {
      if (err) console.log(chalk.red.dim("Error:"), chalk.red(JSON.stringify(err)));
      console.log(chalk.green.dim("Report timestamp:"), chalk.green(JSON.stringify(value)));
    });
    augur.api.InitialReporter.getOwner({ tx: { to: contractId  }}, function (err, userAddress) {
      if (err) console.log(chalk.red.dim("Error:"), chalk.red(JSON.stringify(err)));
      console.log(chalk.green.dim("User address:"), chalk.green(JSON.stringify(userAddress)));
      process.exit(0);
    });
  });
});

