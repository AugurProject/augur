#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var async = require("async");
var BigNumber = require("bignumber.js");

function help() {
  console.log(chalk.red("Get share tokens on market outcomes for user account"));
  console.log(chalk.red("Adjusted Shares is formatted shares times numTicks"));
  console.log(chalk.red("Shows market mailbox balance as well"));
}

function getMarketBalance(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var address = args.opt.account;
  var marketId = args.opt.marketId;
  console.log(chalk.cyan.dim("address:"), chalk.green(address));
  console.log(chalk.cyan.dim("universe:"), chalk.green(universe));
  console.log(chalk.cyan.dim("marketId:"), chalk.green(marketId));
  augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var market = marketsInfo[0];
    var numTicks = market.numTicks;
    var outcomes = Array.from(Array(market.numOutcomes).keys());
    var marketMailboxAddress = market.marketCreatorMailbox;
    console.log(chalk.green.dim("Mailbox owner:"), chalk.green(market.marketCreatorMailboxOwner));
    console.log(chalk.green.dim("market mailbox address:"), chalk.green(marketMailboxAddress));
    augur.api.Cash.balanceOf({ _owner: marketMailboxAddress }, function (err, cashBalance) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      var bnCashBalance = speedomatic.bignum(cashBalance);
      augur.rpc.eth.getBalance([marketMailboxAddress, "latest"], function (err, attoEthBalance) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        var bnAttoEthBalance = speedomatic.bignum(attoEthBalance);
        var combined = speedomatic.unfix(bnAttoEthBalance.plus(bnCashBalance), "string");
        console.log(chalk.green.dim("Total balance:"), chalk.green(combined));
        console.log(chalk.yellow.dim("numTicks"), chalk.yellow(numTicks));
        async.eachSeries(outcomes, function (outcomeId, nextOutcome) {
          console.log(chalk.yellow.dim("Outcome: "), chalk.yellow(outcomeId));
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
              console.log("attoShare: " + chalk.green(balance));
              console.log("Shares: " + chalk.green(speedomatic.unfix(balance, "string")));
              console.log("Adjusted Shares: " + chalk.green(adjusted));
              nextOutcome(null);
            });
          });
        }, function (err) {
          if (err) console.log(chalk.red(err));
          callback(null);
        });
      });
    });
  });
}

module.exports = getMarketBalance;
