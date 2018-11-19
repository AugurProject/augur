#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var async = require("async");
var BigNumber = require("bignumber.js");
var constants = require("../../src/constants");

function help() {
  console.log(chalk.red("Get share tokens on market outcomes for user account"));
  console.log(chalk.red("Adjusted Shares is formatted shares times numTicks"));
  console.log(chalk.red("Shows market mailbox balance as well"));
}

function showWinningBalance(augur, marketId, address, callback) {
  var winningPayload = {marketIds: [marketId], account: address };
  augur.augurNode.submitRequest("getWinningBalance", winningPayload, function (err, value) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    console.log(chalk.yellow.dim("Account Winning Balance"));
    console.log(chalk.yellow.dim("Balance: "), chalk.yellow(JSON.stringify(value)));
    callback(err, value);
  });
}

function showCashBalance(augur, address, label, callback) {
  augur.api.Cash.balanceOf({ _owner: address }, function (err, cashBalance) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var bnCashBalance = speedomatic.bignum(cashBalance);
    var totalCashBalance = speedomatic.unfix(bnCashBalance, "string");
    console.log(chalk.green.dim("Total Cash balance:"), chalk.green(totalCashBalance));
    callback(null);
  });
}

function showEthBalance(augur, address, label, callback) {
  augur.rpc.eth.getBalance([address, "latest"], function (err, attoEthBalance) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var bnCashBalance = speedomatic.bignum(attoEthBalance);
    var totalCashBalance = speedomatic.unfix(bnCashBalance, "string");
    console.log(chalk.green.dim("Total ETH balance:"), chalk.green(totalCashBalance));
    callback(null);
  });
}

function showBalances(augur, address, label, callback) {
  console.log(chalk.yellow.dim(label), chalk.yellow(address));
  showCashBalance(augur, address, label, function (err) {
    if (err) {
      console.log(chalk.red(err));
    }
    showEthBalance(augur, address, label, callback);
  });
}


function getMarketBalance(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var address = args.opt.account;
  var marketId = args.opt.marketId;
  if (address) console.log(chalk.cyan.dim("address:"), chalk.green(address));
  console.log(chalk.cyan.dim("universe:"), chalk.green(universe));
  console.log(chalk.cyan.dim("marketId:"), chalk.green(marketId));
  augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var market = marketsInfo[0];
    var showMarketWinningBalance = market.reportingState === constants.REPORTING_STATE.FINALIZED || market.reportingState === constants.REPORTING_STATE.AWAITING_FINALIZATION;
    var numTicks = market.numTicks;
    var outcomes = Array.from(Array(market.numOutcomes).keys());
    var marketMailboxAddress = market.marketCreatorMailbox;
    console.log(chalk.green.dim("Mailbox owner:"), chalk.green(market.marketCreatorMailboxOwner));
    async.series({
      feeWindowBalance: function (next) {
        if (market.feeWindow !== "0x0000000000000000000000000000000000000000") {
          showBalances(augur, market.feeWindow, "Fee window address", function (err) {
            if (err) {
              console.log(chalk.red(err));
            }
            next(null);
          });
        } else {
          next(null);
        }
      },
      mailboxBalance: function (next) {
        showBalances(augur, marketMailboxAddress, "Mailbox address", function (err) {
          if (err) {
            console.log(chalk.red(err));
          }
          next(null);
        });
      },
      showWinningBalance: function (next) {
        if (address && showMarketWinningBalance) {
          console.log(chalk.yellow.dim("Market State"), chalk.yellow(market.reportingState));
          showWinningBalance(augur, marketId, address, function (err) {
            if (err) {
              console.log(chalk.red(err));
            }
            next(null);
          });
        } else {
          next(null);
        }
      },
      showAccountMarketBalance: function (next) {
        if (address) {
          async.eachSeries(outcomes, function (outcomeId, nextOutcome) {
            augur.api.Market.getShareToken({tx: { to: marketId}, _outcome: outcomeId}, function (err, shareToken) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              var shareTokenPayload = { tx: { to: shareToken }, _owner: address };
              augur.api.ShareToken.balanceOf(shareTokenPayload, function (err, balance) {
                if (err) {
                  console.log(chalk.red(err));
                  return callback(err);
                }
                var adjusted = new BigNumber(speedomatic.unfix(balance, "string")).times(new BigNumber(numTicks));
                console.log(chalk.yellow.dim("Market Outcome: "), chalk.yellow(outcomeId));
                console.log("attoShare: " + chalk.green(balance), "Shares: " + chalk.green(speedomatic.unfix(balance, "string")), "Adjusted Shares: " + chalk.green(adjusted));
                nextOutcome(null);
              });
            });
          }, function (err) {
            if (err) console.log(chalk.red(err));
            next(null);
          });
        } else {
          next(null);
        }
      },
    }, callback);
  });
}

module.exports = getMarketBalance;
