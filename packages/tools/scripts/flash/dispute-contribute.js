#!/usr/bin/env node

"use strict";

var BigNumber = require("bignumber.js");
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
  console.log(chalk.red("Time is pushed into the next dispute windows if not in initial multiple dispute window"));
  console.log(chalk.red("user will be given REP if balance is 0"));
  console.log(chalk.red("Use noPush to just dispute contribute and not worry about moving time"));
}

function disputeContribute(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var amount = args.opt.amount;
  var marketId = args.opt.marketId;
  var outcome = args.opt.outcome;
  var description = args.opt.description;
  var asPrice = args.opt.asPrice;  
  var noPush = args.opt.noPush;
  getRepTokens(augur, amount || 10000, auth, function(err) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      return callback(err);
    }
    if (err) return console.error(err);
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback("Could not get market info");
      }

      var market = marketsInfo[0];
      var payoutNumerators = getPayoutNumerators(market, outcome, asPrice);
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      getBalance(augur, universe, auth.address, function(err, balances) {
        if (err) {
          console.log(chalk.red(err));
          return callback(JSON.stringify(err));
        }

        var disputeAmount = amount || balances.reputation;
        console.log(chalk.yellow.dim("amount"), disputeAmount);
        var attoREP = speedomatic.fix(disputeAmount, "hex");
        console.log(chalk.cyan("Balances:"));
        console.log("Ether: " + chalk.green(balances.ether));
        console.log("Rep:   " + chalk.green(balances.reputation));
        var universePayload = { tx: { to: universe } };
        augur.api.Universe.getDisputeThresholdForDisputePacing(universePayload, (err, threshold) => {
          if (err) {
            return callback(err);
          }
          var attoThreshold = new BigNumber(threshold).toFixed();
          console.log(chalk.cyan("Dispute Threshold:"), chalk.green(attoThreshold));

          var marketPayload = { tx: { to: marketId } };
          augur.api.Market.derivePayoutDistributionHash(
            Object.assign(marketPayload, {
              _payoutNumerators: payoutNumerators
            }),
            (err, disputeHash) => {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              augur.api.Market.getWinningReportingParticipant(marketPayload, (err, winningDisputeCrowdsourcer) => {
                if (err) {
                  console.log(chalk.red(err));
                  return callback(err);
                }
                const disputerPayload = {
                  tx: { to: winningDisputeCrowdsourcer }
                };
                augur.api.DisputeCrowdsourcer.getPayoutDistributionHash(disputerPayload, (err, winningHash) => {
                  if (err) {
                    console.log(chalk.red(err));
                    return callback(err);
                  }
                  if (winningHash === disputeHash) {
                    return callback("This outcome is already winning");
                  }
                  augur.api.DisputeCrowdsourcer.getSize(disputerPayload, (err, disputeSize) => {
                    if (err) {
                      console.error("Could not get dispute crowedsourcer current bond size");
                    } else {
                      console.log(
                        chalk.cyan("Winning DisputeCrowdsourcer Size:"),
                        chalk.green(new BigNumber(disputeSize).toFixed())
                      );
                    }
                    if (noPush) {
                      doMarketContribute(augur, marketId, attoREP, payoutNumerators, description, auth, function(err) {
                        if (err) {
                          return callback("Market contribute Failed");
                        }
                        console.log(chalk.green("Market contribute Done"));
                        return callback(null);
                      });
                    } else {
                      augur.api.Market.getDisputeWindow(marketPayload, function(err, disputeWindowId) {
                        if (err) {
                          console.log(chalk.red(err));
                          return callback("Could not get Dispute Window");
                        }

                        if (disputeWindowId === "0x0000000000000000000000000000000000000000") {
                          console.log(chalk.red("disputeWindowId has not been created"));
                          return callback("Market doesn't have dispute window, need to report");
                        }
                        var disputeWindowPayload = {
                          tx: { to: disputeWindowId }
                        };
                        augur.api.DisputeWindow.getStartTime(disputeWindowPayload, function(
                          err,
                          disputeWindowStartTime
                        ) {
                          if (err) {
                            console.log(chalk.red(err));
                            return callback("Could not get Dispute Window");
                          }

                          getTime(augur, auth, function(err, timeResult) {
                            if (err) {
                              console.log(chalk.red(err));
                              return callback(err);
                            }

                            var setTime = parseInt(disputeWindowStartTime, 10) + day;
                            displayTime("Current timestamp", timeResult.timestamp);
                            displayTime("dispute Window end time", disputeWindowStartTime);
                            displayTime("Set Time to", setTime);
                            setTimestamp(augur, setTime, timeResult.timeAddress, auth, function(err) {
                              if (err) {
                                console.log(chalk.red(err));
                                return callback(err);
                              }
                              console.log(
                                chalk.yellow("sending amount REP"),
                                chalk.yellow(attoREP),
                                chalk.yellow(disputeAmount)
                              );
                              augur.api.DisputeWindow.isActive(disputeWindowPayload, function(err, result) {
                                if (err) {
                                  console.log(chalk.red(err));
                                  return callback(err);
                                }
                                console.log(chalk.green.dim("Dispute Window is active"), chalk.green(result));
                                if (result) {
                                  doMarketContribute(
                                    augur,
                                    marketId,
                                    attoREP,
                                    payoutNumerators,
                                    description,
                                    auth,
                                    function(err) {
                                      if (err) {
                                        return callback("Market contribute Failed");
                                      }
                                      console.log(chalk.green("Market contribute Done"));
                                      return callback(null);
                                    }
                                  );
                                } else {
                                  console.log(chalk.red("Dispute Window isn't active"));
                                  return callback("Dispute Window isn't active");
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
          );
        });
      });
    });
  });
}

module.exports = disputeContribute;
