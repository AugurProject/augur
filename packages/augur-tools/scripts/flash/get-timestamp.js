#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function getTime(augur, auth, callback) {
  var controller =
    augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;
  augur.api.Controller.lookup(
    {
      meta: auth,
      tx: { to: controller },
      _key: augur.format.tag.encodeTag("Time")
    },
    function(err, timeAddress) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
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
