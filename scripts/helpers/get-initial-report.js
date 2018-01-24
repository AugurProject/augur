#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var marketID = process.argv[2];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  if (!marketID) { console.log(chalk.red("marketID is needed")); process.exit(1); }
  augur.api.Market.getInitialReporter({ tx: { to: marketID  }}, function (err, contractID) {
    if (err) console.log(chalk.red.dim("Error:"), chalk.green(JSON.stringify(err)));
    console.log(chalk.green.dim("Initial Reporter Contract address:"), chalk.green(JSON.stringify(contractID)));
    augur.api.InitialReporter.getReportTimestamp({ tx: { to: contractID  }}, function (err, value) {
      if (err) console.log(chalk.red.dim("Error:"), chalk.red(JSON.stringify(err)));
      console.log(chalk.green.dim("Report timestamp:"), chalk.green(JSON.stringify(value)));
    });
    augur.api.InitialReporter.getOwner({ tx: { to: contractID  }}, function (err, userAddress) {
      if (err) console.log(chalk.red.dim("Error:"), chalk.red(JSON.stringify(err)));
      console.log(chalk.green.dim("User address:"), chalk.green(JSON.stringify(userAddress)));
      process.exit(0);
    });
  });
});

