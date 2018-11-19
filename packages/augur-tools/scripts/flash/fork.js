#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var displayTime = require("./display-time");
var goToFork = require("./go-to-fork");
var getPayoutNumerators = require("./get-payout-numerators");
var repFaucet = require("../rep-faucet");

function help() {
  console.log(chalk.red("Push a market through dispute rounds to cause a fork"));
  console.log(chalk.red("User will be given REP sufficient to cause a fork"));
}

/**
 * Move time to Market end time and do go to a fork
 */
function fork(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  repFaucet(augur, 10000000, auth, function (err) {
    if (err) return callback(err);
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketId } };
      augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
        displayTime("Market End Time", endTime);
        getTime(augur, auth, function (err, timeResult) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          var day = 108000; // day
          endTime = parseInt(endTime, 10) + (day * 3); // push time after designated reporter time
          displayTime("Move time to ", endTime);
          setTimestamp(augur, endTime, timeResult.timeAddress, auth, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            var priceOrOutcome = market.marketType === "scalar" ? market.minPrice : 0;
            var payoutNumerators = getPayoutNumerators(market, priceOrOutcome, false);
            goToFork(augur, marketId, payoutNumerators, timeResult.timeAddress, args.opt.stopsBefore, auth, function (err) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              console.log(chalk.green("Fork Done"));
              callback(null);
            });
          });
        });
      });
    });
  });
}

module.exports = fork;
