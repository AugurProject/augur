#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var theGetBalance = require("../dp/lib/get-balances");

function getBalanceInternal(augur, universe, address, callback) {
  console.log(chalk.green.dim("address:"), chalk.green(address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  theGetBalance(augur, universe, address, function (err, balances) {
    if (err) {
      console.log(chalk.red(err));
      return callback(JSON.stringify(err));
    }
    console.log(chalk.cyan("Balances:"));
    console.log("Ether:      " + chalk.green(balances.ether));
    console.log("Reputation: " + chalk.green(balances.reputation));
    callback(null);
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> <user address>"));
  console.log(chalk.red("account address is needed to get balances"));
  callback(null);
}

function getBalance(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    var account = params;
    if (account === undefined) {
      account = auth.address;
    }
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    getBalanceInternal(augur, universe, account, callback);
  }
}

module.exports = getBalance;
