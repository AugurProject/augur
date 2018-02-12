#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var encodeTag = require("../../src/format/tag/encode-tag");

function getTime(augur, auth, callback) {
  var controller = augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;
  augur.api.Controller.lookup({ meta: auth, tx: {to: controller}, _key: encodeTag("Time")}, function (err, timeAddress) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var timestamp = augur.api.Controller.getTimestamp();
    callback(null, {
      timestamp: timestamp,
      timeAddress: timeAddress,
    });
  });
}

module.exports = getTime;
