#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function getTime(augur, auth, callback) {
  var augurContract =
    augur.contracts.addresses[augur.rpc.getNetworkID()].Augur;
  var _key = "0x54696d6500000000000000000000000000000000000000000000000000000000"; // "Time"
  augur.api.Augur.lookup(
    {
      meta: auth,
      tx: { to: augurContract },
      _key
    },
    function(err, timeAddress) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      if (timeAddress === "0x0000000000000000000000000000000000000000") {
        return callback("time contract address not found");
      }
      augur.api.Augur.getTimestamp(function(err, timestamp) {
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
