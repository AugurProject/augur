#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var getPrivateKey = require("../dp/lib/get-private-key").getPrivateKey;
var marketID = process.argv[2];
var getTime = require("./get-timestamp");

var augur = new Augur();

/**
 * Get Market Fee window and set the time to the end then do market finalization
 */
getPrivateKey(null, function (err, auth) {
  if (err) {
    console.error("getPrivateKey failed:", err);
    process.exit(1);
  }
  augur.connect(connectionEndpoints, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var marketPayload = { tx: { to: marketID } };
    augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowAddress) {
      var feeWindowPayload = { tx: { to: feeWindowAddress } };
      augur.api.FeeWindow.getEndTime(feeWindowPayload, function (err, endTime) {
        getTime(auth, function (timeResult) {
          var currentTime = timeResult.timestamp;
          console.log(chalk.red.dim("Old Current Time"), chalk.red(currentTime));
          var timePayload = {
            meta: auth,
            tx: { to: timeResult.timeAddress },
            _timestamp: parseInt(endTime, 10),
            onSent: function () {},
            onSuccess: function () {
              console.log(chalk.green.dim("Current time"), chalk.green(endTime));
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
  });
});
