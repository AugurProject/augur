#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var Web3 = require("web3");

function getTime(augur, auth, callback) {
  var web3 = new Web3();
  var controller =
    augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;
  var _key = web3.fromAscii("Time");
  console.log(_key);
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
