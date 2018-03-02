#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var constants = require("../../src/constants");

function doInitialReport(augur, marketId, payoutNumerators, invalid, auth, callback) {
  augur.api.Market.doInitialReport({
    meta: auth,
    tx: { to: marketId, gas: constants.DEFAULT_MAX_GAS },
    _payoutNumerators: payoutNumerators,
    _invalid: invalid,
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
      callback(null, result);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
      callback(result, null);
    },
  });
}

module.exports = doInitialReport;
