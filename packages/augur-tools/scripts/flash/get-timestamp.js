#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function getTime(augur, auth, callback) {
  var controller =
    augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;
  var _key = "0x54696d6500000000000000000000000000000000000000000000000000000000"; // "Time"
  console.log(_key, controller);
  augur.api.Controller.lookup(
    {
      meta: auth,
      tx: { to: controller },
      _key
    },
    function(err, timeAddress) {
      console.log("get time address", err, timeAddress);
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      if (timeAddress === "0x0000000000000000000000000000000000000000") {
        return callback("time contract address not found");
      }
      augur.api.Controller.getTimestamp(function(err, timestamp) {
        if (err) {
          console.log(chalk.red("issue getting timestamp"));
          return callback(err);
        }
        callback(null, {
          timestamp: timestamp,
          timeAddress: timeAddress
        });
      });
    }
  );
}

module.exports = getTime;
