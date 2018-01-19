#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var marketID = process.argv[2];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var finalizePayload = { tx: { to: marketID  },
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

  console.log(chalk.green.dim("finalizePayload:"), chalk.green(JSON.stringify(finalizePayload)));
  augur.api.Market.finalize(finalizePayload);
});


