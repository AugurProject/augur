#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function doMarketContribute(
  augur,
  marketId,
  attoREP,
  payoutNumerators,
  auth,
  callback
) {
  augur.api.Market.contribute({
    meta: auth,
    tx: { to: marketId, gas: augur.constants.DEFAULT_MAX_GAS },
    _payoutNumerators: payoutNumerators,
    _amount: attoREP,
    onSent: function(result) {
      console.log(
        chalk.yellow.dim("Sent Dispute:"),
        chalk.yellow(JSON.stringify(result))
      );
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function(result) {
      console.log(
        chalk.green.dim("Success Dispute:"),
        chalk.green(JSON.stringify(result))
      );
      callback(null);
    },
    onFailed: function(result) {
      console.log(
        chalk.red.dim("Failed Dispute:"),
        chalk.red(JSON.stringify(result))
      );
      callback(result);
    }
  });
}

module.exports = doMarketContribute;
