#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function help() {
  console.log(chalk.red("Pulls the escape hatch"));
}

function escapeHatch(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var controller = augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;
  augur.api.Controller.emergencyStop({
    meta: auth,
    tx: {to: controller},
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green("Escape Hatch Pulled"));
      callback(null, result);
    },
    onFailed: function (result) {
      console.log(chalk.red(result));
      callback(result, null);
    },
  });
}

module.exports = escapeHatch;
