#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var theGetBalance = require("../dp/lib/get-balances");
var speedomatic = require("speedomatic");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("Use this command to get REP and ETH balances for account"));
}

function showCashBalance(augur, address, label, callback) {
  augur.api.Cash.balanceOf({ _owner: address }, function (err, cashBalance) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var bnCashBalance = speedomatic.bignum(cashBalance);
    var totalCashBalance = speedomatic.unfix(bnCashBalance, "string");
    console.log("Cash:", chalk.green(totalCashBalance));
    callback(null);
  });
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
    showCashBalance(augur, address, "Cash Balance", function (err) {
      if (err) {
        console.log(chalk.red(err));
        return callback(JSON.stringify(err));
      }
      var universePayload = { tx: { to: universe } };
      augur.api.Universe.getCurrentFeeWindow(universePayload, function (err, feeWindow) {
        if (err) {
          console.log(chalk.red(err));
          return callback(JSON.stringify(err));
        }
        var feeWindowPayload = { tx: { to: feeWindow } };
        augur.api.FeeWindow.getStartTime(feeWindowPayload, function (err, startTime) {
          if (err) {
            console.log(chalk.red(err));
            return callback(JSON.stringify(err));
          }
          augur.api.FeeWindow.getEndTime(feeWindowPayload, function (err, endTime) {
            if (err) {
              console.log(chalk.red(err));
              return callback(JSON.stringify(err));
            }
            feeWindowPayload = { tx: { to: feeWindow }, _owner: address };
            augur.api.FeeWindow.balanceOf(feeWindowPayload, function (err, balance) {
              if (err) {
                console.log(chalk.red(err));
                return callback(JSON.stringify(err));
              }
              console.log(chalk.cyan("Current Fee Window:"));
              console.log(chalk.green.dim("fee window:"), chalk.green(feeWindow));
              displayTime("Start Time", startTime);
              displayTime("End Time", endTime);
              console.log("Participation Tokens: " + chalk.green(speedomatic.unfix(balance, "string")));

              callback(null);
            });
          });
        });
      });
    });
  });

}

module.exports = getBalance;
