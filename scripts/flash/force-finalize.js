#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var repFaucet = require("../rep-faucet");
var getPayoutNumerators = require("./get-payout-numerators");
var doInitialReport = require("./do-initial-report");
var displayTime = require("./display-time");
var finalizeMarket = require("./finalize-market");

function help() {
  console.log(chalk.red("Force market to finalize reporting state"));
  console.log(chalk.red("parameters are market id"));
  console.log(chalk.red("' -m <marketID>', means finalize this market"));
}

function forceFinalize(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  repFaucet(augur, 10000000, auth, function (err) {
    if (err) return callback(err);
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
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
            doInitialReport(augur, marketId, payoutNumerators, false, auth, function (err) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              finalizeMarket(augur, marketId, auth, callback);
            });
          });
        });
      });
    });
  });
}

module.exports = forceFinalize;
