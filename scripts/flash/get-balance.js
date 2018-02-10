#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");


function getBalanceInternal(augur, universe, account) {
  console.log(chalk.green.dim("address:"), chalk.green(account));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  augur.api.Universe.getReputationToken({ tx: { to: universe } }, function (err, reputationTokenAddress) {
    if (err) { console.error("Could not get universe"); process.exit(1); }
    augur.api.ReputationToken.balanceOf({ tx: { to: reputationTokenAddress }, _owner: account }, function (err, reputationBalance) {
      if (err) { console.error("ReputationToken.balanceOf failed:", err); process.exit(1); }
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
}

function help(callback) {
  console.log(chalk.red("account address is needed to get balances"));
  callback(null);
}

function getBalance(augur, params, callback) {
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  if (!params || params === "help") {
    help(callback);
  } else {
    var account = params;
    getBalanceInternal(augur, universe, account, callback);
  }
}

module.exports = getBalance;
