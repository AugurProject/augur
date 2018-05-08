#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var async = require("async");
var BigNumber = require("bignumber.js");

function help() {
  console.log(chalk.red("Get share tokens on market outcomes for user account"));
  console.log(chalk.red("Adjusted Shares is formatted shares times numTicks"));
}

function getMarketBalance(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var address = args.opt.account;
  var marketId = args.opt.marketId;
  console.log(chalk.green.dim("address:"), chalk.green(address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  console.log(chalk.green.dim("marketId:"), chalk.green(marketId));
  augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var market = marketsInfo[0];
    var numTicks = market.numTicks;
    console.log(chalk.yellow.dim("numTicks"), chalk.yellow(numTicks));
    var outcomes = Array.from(Array(market.numOutcomes).keys());
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
}

module.exports = getMarketBalance;
