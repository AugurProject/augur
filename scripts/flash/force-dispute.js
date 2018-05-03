#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var repFaucet = require("../rep-faucet");
var getPayoutNumerators = require("./get-payout-numerators");
var doInitialReport = require("./do-initial-report");
var doMarketContribute = require("./do-market-contribute");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("Force market to dispute a number of rounds, default is 10"));
  console.log(chalk.red("This will submit an initial report on market if needed"));
  console.log(chalk.red("If you want to force a fork use the fork command"));
  console.log(chalk.red("' -m <marketID> -r 7', means dispute this market 7 times"));
}

function dispute(augur, marketId, payoutNumerators, auth, timeAddress, currentRound, totalRounds, callback) {
  console.log(chalk.yellow("Dispute Round:", currentRound));
  var ALL_THE_REP = 6000000000000000000000000;
  augur.api.Market.getFeeWindow({tx: { to: marketId}}, function (err, feeWindow) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    augur.api.FeeWindow.getStartTime({ tx: { to: feeWindow } }, function (err, feeWindowStartTime) {
      if (err) {
        console.log(chalk.red(err));
        callback("Could not get Fee Window");
      }
      setTimestamp(augur, parseInt(feeWindowStartTime, 10) + 1, timeAddress, auth, function (err) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        doMarketContribute(augur, marketId, ALL_THE_REP, payoutNumerators, false, auth, function (err) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          if (currentRound === totalRounds - 1) return callback(null);
          dispute(augur, marketId, payoutNumerators.reverse(), auth, timeAddress, ++currentRound, totalRounds, callback);
        });
      });
    });
  });
}

function doReporting(augur, market, timeResult, auth, rounds, callback) {
  var marketId = market.id;
  var priceOrOutcome = market.marketType === "scalar" ? market.minPrice : 0;
  var payoutNumerators = getPayoutNumerators(market, priceOrOutcome, false);

  augur.api.Market.getFeeWindow({tx: { to: marketId}}, function (err, feeWindow) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    if (feeWindow !== "0x0000000000000000000000000000000000000000") {
      dispute(augur, marketId, payoutNumerators.reverse(), auth, timeResult.timeAddress, 0, rounds, callback);
    } else {
      doInitialReport(augur, marketId, payoutNumerators, false, auth, function (err) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        dispute(augur, marketId, payoutNumerators.reverse(), auth, timeResult.timeAddress, 0, rounds, callback);
      });
    }
  });
}

function forceDispute(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  var rounds = parseInt(args.opt.rounds, 10);
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
            doReporting(augur, market, timeResult, auth, rounds, callback);
          });
        });
      });
    });
  });
}

module.exports = forceDispute;
