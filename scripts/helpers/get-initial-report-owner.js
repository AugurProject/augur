#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var contractID = process.argv[2];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  augur.api.InitialReporter.getOwner({ tx: { to: contractID  }}, function (err, result) {
    if (err) console.log(chalk.red.dim("Error:"), chalk.green(JSON.stringify(err)));
    console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
    process.exit(0);
  });
});

