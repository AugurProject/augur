#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");

function help() {
  console.log(chalk.red("Approves account address, used for trading"));
}

function approveAccount(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var address = args.opt.address;
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("address:"), chalk.green(address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  approveAugurEternalApprovalValue(augur, address, auth, function (err) {
    if (err) {
      console.log(chalk.red(err));
      return callback(JSON.stringify(err));
    }
    callback(null);
  });
}

module.exports = approveAccount;
