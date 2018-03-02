#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");
var getTime = require("./get-timestamp");

function setTimestamp(augur, newTimestamp, address, auth, callback) {
  displayTime("setting time to", newTimestamp);
  getTime(augur, auth, function (err, timeResult) {
    if (parseInt(timeResult.timestamp, 10) === parseInt(newTimestamp, 10)) {
      console.log(chalk.yellow.dim("Time already set"));
      callback(null);
    }

    augur.api.TimeControlled.setTimestamp({
      meta: auth,
      tx: { to: address },
      _timestamp: newTimestamp,
      onSent: function (result) {
        console.log(chalk.yellow.dim("Sent Change Time"), chalk.yellow(JSON.stringify(result)));
        console.log(chalk.yellow.dim("Waiting for reply ...."));
      },
      onSuccess: function (result) {
        augur.api.Controller.getTimestamp(function (err, timestamp) {
          if (err) {
            console.log(chalk.red("Error "), chalk.red(err));
            return callback(err);
          }
          console.log(chalk.green.dim("Success"), chalk.green(JSON.stringify(result)));
          displayTime("result of time change", timestamp);
          callback(null);
        });
      },
      onFailed: function (result) {
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
        callback(result);
      },
    });
  });
}

module.exports = setTimestamp;
