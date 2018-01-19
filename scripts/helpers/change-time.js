#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var getPrivateKey = require("../canned-markets/lib/get-private-key");
var encodeTag = require("../../src/format/tag/encode-tag");

var keystoreFilePath = process.argv[2];
var time = process.argv[3];

var augur = new Augur();

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    var timestamp = augur.api.Controller.getTimestamp();
    console.log(chalk.yellow.dim("current timestamp: "), chalk.yellow(timestamp));
    console.log(chalk.yellow.dim("setting to: "), chalk.yellow(time));
    var controller = augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;

    augur.api.Controller.lookup({ meta: auth, tx: {to: controller}, _key: encodeTag("Time")}, function (err, timeAddress) {
      console.log("Time Address", timeAddress);
      var timePayload = {
        meta: auth,
        tx: { to: timeAddress  },
        _timestamp: parseInt(time, 10),
        onSent: function (result) {
          console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
        },
        onSuccess: function (result) {
          console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
          console.log(chalk.green.dim("Current Time"), chalk.green(augur.api.Controller.getTimestamp()));
          process.exit(1);
        },
        onFailed: function (result) {
          console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
          process.exit(0);
        },
      };
      augur.api.TimeControlled.setTimestamp(timePayload);
    });
  });
});
