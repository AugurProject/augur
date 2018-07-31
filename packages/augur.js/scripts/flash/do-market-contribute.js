#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var constants = require("../../src/constants");

function doMarketContribute(augur, marketId, attoREP, payoutNumerators, invalid, auth, callback) {
  augur.api.Market.contribute({
    meta: auth,
    tx: { to: marketId, gas: constants.DEFAULT_MAX_GAS },
    _payoutNumerators: payoutNumerators,
    _invalid: invalid,
    _amount: attoREP,
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent Dispute:"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green.dim("Success Dispute:"), chalk.green(JSON.stringify(result)));
      callback(null);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed Dispute:"), chalk.red(JSON.stringify(result)));
      callback(result);
    },
  });
}

module.exports = doMarketContribute;
