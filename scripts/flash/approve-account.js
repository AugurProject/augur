#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");

function approveInternal(augur, address, universe, auth, callback) {
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

function help(callback) {
  console.log(chalk.red("params syntax --> <user address>"));
  console.log(chalk.red("account address is needed to get approval"));
  callback(null);
}

function approveAccount(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    var account = params;
    if (account == null) {
      account = auth.address;
    }
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    approveInternal(augur, account, universe, auth, callback);
  }
}

module.exports = approveAccount;
