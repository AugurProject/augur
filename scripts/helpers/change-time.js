#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var getPrivateKey = require("../canned-markets/lib/get-private-key");
var getTime = require("./get-timestamp");

var time = process.argv[2];

var augur = new Augur();

getPrivateKey(null, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    console.log(chalk.yellow.dim("setting to: "), chalk.yellow(time));

    getTime(auth, function (result) {
      console.log(chalk.yellow.dim("current timestamp: "), chalk.yellow(result.timestamp));
      var timePayload = {
        meta: auth,
        tx: { to: result.timeAddress  },
        _timestamp: parseInt(time, 10),
        onSent: function (result) {
          console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
        },
        onSuccess: function (result) {
          console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
          console.log(chalk.green.dim("Current Time"), chalk.green(augur.api.Controller.getTimestamp()));
          process.exit(0);
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
