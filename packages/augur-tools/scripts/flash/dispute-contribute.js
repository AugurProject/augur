#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var getRepTokens = require("./get-rep-tokens");
var speedomatic = require("speedomatic");
var displayTime = require("./display-time");
var setTimestamp = require("./set-timestamp");
var getPayoutNumerators = require("./get-payout-numerators");
var doMarketContribute = require("./do-market-contribute");
var getBalance = require("../dp/lib/get-balances");

var day = 108000; // day

function help() {
  console.log(chalk.red("This command is meant to dispute one round"));
  console.log(chalk.red("Time is pushed into the next fee windows so that the market can be disputed"));
  console.log(chalk.red("If there isn't a next fee window then the market will needed to be reporterd on, which creates a next fee window"));
  console.log(chalk.red("user will be give REP if balance is 0"));
  console.log(chalk.red("Use noPush to just dispute contribute and not worry about time moving"));
}

function disputeContribute(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var amount = args.opt.amount;
  var marketId = args.opt.marketId;
  var outcome = args.opt.outcome;
  var invalid = args.opt.invalid;
  var noPush = args.opt.noPush;
  getRepTokens(augur, amount || 10000, auth, function (err) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      return callback(err);
    }
    if (err) return console.error(err);
    invalid = !invalid ? false : true;
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback("Could not get market info");
      }

      var market = marketsInfo[0];
      var payoutNumerators = getPayoutNumerators(market, outcome, invalid);
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      getBalance(augur, universe, auth.address, function (err, balances) {
        if (err) {
          console.log(chalk.red(err));
          return callback(JSON.stringify(err));
        }

        var disputeAmount = amount || balances.reputation;
        console.log(chalk.yellow.dim("amount"), disputeAmount);
        var attoREP = speedomatic.fix(disputeAmount, "hex");
        if (noPush) {
          console.log(chalk.cyan("Balances:"));
          console.log("Ether: " + chalk.green(balances.ether));
          console.log("Rep:   " + chalk.green(balances.reputation));
          doMarketContribute(augur, marketId, attoREP, payoutNumerators, invalid, auth, function (err) {
            if (err) {
              return callback("Market contribute Failed");
            }
            console.log(chalk.green("Market contribute Done"));
            return callback(null);
          });

        } else {

          var marketPayload = { tx: { to: marketId } };
          augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowId) {
            if (err) {
              console.log(chalk.red(err));
              return callback("Could not get Fee Window");
            }

            if (feeWindowId === "0x0000000000000000000000000000000000000000") {
              console.log(chalk.red("feeWindowId has not been created"));
              return callback("Market doesn't have fee window, need to report");
            }
            console.log(chalk.yellow("Market Fee Window"), chalk.yellow(feeWindowId));
            var feeWindowPayload = { tx: { to: feeWindowId } };
            augur.api.FeeWindow.getStartTime(feeWindowPayload, function (err, feeWindowStartTime) {
              if (err) {
                console.log(chalk.red(err));
                return callback("Could not get Fee Window");
              }

              getTime(augur, auth, function (err, timeResult) {
                if (err) {
                  console.log(chalk.red(err));
                  return callback(err);
                }

                var setTime = parseInt(feeWindowStartTime, 10) + day;
                displayTime("Current timestamp", timeResult.timestamp);
                displayTime("Fee Window end time", feeWindowStartTime);
                displayTime("Set Time to", setTime);
                setTimestamp(augur, setTime, timeResult.timeAddress, auth, function (err) {
                  if (err) {
                    console.log(chalk.red(err));
                    return callback(err);
                  }

                  console.log(chalk.yellow("sending amount REP"), chalk.yellow(attoREP), chalk.yellow(disputeAmount));
                  augur.api.FeeWindow.isActive(feeWindowPayload, function (err, result) {
                    if (err) {
                      console.log(chalk.red(err));
                      return callback(err);
                    }

                    console.log(chalk.green.dim("Few Window is active"), chalk.green(result));
                    if (result) {
                      doMarketContribute(augur, marketId, attoREP, payoutNumerators, invalid, auth, function (err) {
                        if (err) {
                          return callback("Market contribute Failed");
                        }

                        console.log(chalk.green("Market contribute Done"));
                        return callback(null);
                      });
                    } else {
                      console.log(chalk.red("Fee Window isn't active"));
                      return callback("Fee Window isn't active");
                    }
                  });
                });
              });
            });
          });
        }
      });
    });
  });
}

module.exports = disputeContribute;
