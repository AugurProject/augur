#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var theGetBalance = require("../dp/lib/get-balances");

function help() {
  console.log(chalk.red("Use this command to get REP and ETH balances for account"));
}

function getBalance(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var address = args.opt.account;
  console.log(chalk.green.dim("address:"), chalk.green(address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  theGetBalance(augur, universe, address, function (err, balances) {
    if (err) {
      console.log(chalk.red(err));
      return callback(JSON.stringify(err));
    }
    console.log(chalk.cyan("Balances:"));
    console.log("Ether: " + chalk.green(balances.ether));
    console.log("Rep:   " + chalk.green(balances.reputation));
    callback(null);
  });
}

module.exports = getBalance;
