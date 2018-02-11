#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");

function finalizeMarketInternal(augur, marketID, auth, callback) {
  var marketPayload = { tx: { to: marketID } };
  augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowAddress) {
    if (err) { console.error(err); callback(err); }
    if (feeWindowAddress === "0x0000000000000000000000000000000000000000") {
      console.log(chalk.red("Market has not be reported on, need initial-report before finalization"));
      callback(null);
    }
    var feeWindowPayload = { tx: { to: feeWindowAddress } };
    augur.api.FeeWindow.getEndTime(feeWindowPayload, function (err, endTime) {
      endTime = parseInt(endTime, 10) + 10000; // past fee window end time
      getTime(augur, auth, function (timeResult) {
        if (!timeResult) { console.error("Could not get current time"); callback("could not get time"); }
        var currentTime = timeResult.timestamp;
        console.log(chalk.red.dim("Old Current Time"), chalk.red(currentTime));
        var timePayload = {
          meta: auth,
          tx: { to: timeResult.timeAddress  },
          _timestamp: parseInt(endTime, 10),
          onSent: function () {
          },
          onSuccess: function () {
            console.log(chalk.green.dim("Current time"), chalk.green(endTime));
            var finalizePayload = { tx: { to: marketID  },
              onSent: function (result) {
                console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
                console.log(chalk.yellow.dim("Waiting for reply ...."));
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
          },
          onFailed: function (result) {
            console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
            process.exit(1);
          },
        };
        augur.api.TimeControlled.setTimestamp(timePayload);
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax -->  params=marketID"));
  console.log(chalk.red("parameter 1: marketID is needed"));
  callback(null);
}

function finalizeMarket(augur, params, auth, callback) {
  if (!params || params === "help") {
    help(callback);
  } else {
    var marketID = params;
    console.log(chalk.yellow.dim("marketID"), marketID);
    console.log(chalk.yellow.dim("owner"), auth.address);
    finalizeMarketInternal(augur, marketID, auth, callback);
  }
}

module.exports = finalizeMarket;
