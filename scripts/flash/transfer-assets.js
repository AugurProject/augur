#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function help() {
  console.log(chalk.red("Transfer REP or ETH to specific account"));
}

function transferAssets(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var address = args.opt.to;
  var isEther = args.opt.ether;
  var isRep = args.opt.rep;
  var amount = args.opt.amount;
  console.log(chalk.green.dim("to address:"), chalk.green(address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  console.log(chalk.green.dim("asset:"), chalk.green(amount), chalk.green(isEther ? "ETH" : "REP"));

  if (isEther) {
    augur.assets.sendEther({
      meta: auth,
      to: address,
      etherToSend: amount,
      from: auth.address,
      onSent: function () {
        console.log("Transfer Sent");
      },
      onSuccess: function () {
        console.log(chalk.cyan("Transfer Successful"));
        return callback(null);
      },
      onFailed: function (err) {
        console.log(chalk.red(err));
        return callback(err);
      },
    });
  } else if (isRep) {
    augur.assets.sendReputation({
      meta: auth,
      universe: universe,
      reputationToSend: amount,
      _to: address,
      onSent: function () {
        console.log("Transfer Sent");
      },
      onSuccess: function () {
        console.log(chalk.cyan("Transfer Successful"));
        return callback(null);
      },
      onFailed: function (err) {
        console.log(chalk.red(err));
        return callback(err);
      },
    });
  } else {
    var message = "Asset type unknown";
    console.log(chalk.red(message));
    return callback(message);
  }
}

module.exports = transferAssets;
