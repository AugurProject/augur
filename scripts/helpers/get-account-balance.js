#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var speedomatic = require("speedomatic");

var account = process.argv[2];

var augur = new Augur();

if (!account) { console.log(chalk.red("account address is needed")); process.exit(1);}

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  console.log(chalk.green.dim("address:"), chalk.green(account));
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  augur.api.Universe.getReputationToken({ tx: { to: universe } }, function (err, reputationTokenAddress) {
    if (err) return console.error("Could not get universe");
    augur.api.ReputationToken.balanceOf({ tx: { to: reputationTokenAddress }, _owner: account }, function (err, reputationBalance) {
      if (err) return console.error("ReputationToken.balanceOf failed:", err);
      augur.rpc.eth.getBalance([account, "latest"], function (etherBalance) {
        if (!etherBalance || etherBalance.error) return console.error("rpc.eth.getBalance failed:", etherBalance);
        var balances = {
          reputation: speedomatic.unfix(reputationBalance, "string"),
          ether: speedomatic.unfix(etherBalance, "string"),
        };
        console.log(chalk.cyan("Balances:"));
        console.log("Ether:      " + chalk.green(balances.ether));
        console.log("Reputation: " + chalk.green(balances.reputation));
        process.exit(0);
      });
    });
  });
});
