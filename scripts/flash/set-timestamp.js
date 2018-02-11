#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function setTimestamp(augur, numberTicks, address, auth, callback) {
  augur.api.TimeControlled.setTimestamp({
    meta: auth,
    tx: { to: address },
    _timestamp: numberTicks,
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent Change Time"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      var timestamp = augur.api.Controller.getTimestamp();
      console.log(chalk.green.dim("Success"), chalk.green(JSON.stringify(result)));
      displayTime("result of time change", timestamp);
      callback(null);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
      callback(null);
    },
  });
}

module.exports = setTimestamp;
