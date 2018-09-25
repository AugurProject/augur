#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var displayTime = require("./display-time");
var doInitialReport = require("./do-initial-report");
var getPayoutNumerators = require("./get-payout-numerators");

function help() {
  console.log(chalk.red("This command is for reporting on Open Reporting"));
  console.log(chalk.red("Time is pushed after designated reporting time window"));
}

/**
 * Move time to Market end time and do initial report
 */
function initialReport(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  var outcome = args.opt.outcome;
  var invalid = args.opt.invalid;
  var noPush = args.opt.noPush;
  augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
    var market = marketsInfo[0];
    var marketPayload = { tx: { to: marketId } };
    var payoutNumerators = getPayoutNumerators(market, outcome, invalid);
    if (noPush) {
      doInitialReport(augur, marketId, payoutNumerators, invalid, auth, function (err) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        console.log(chalk.green("Initial Report Done"));
        callback(null);
      });
    } else {
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

            doInitialReport(augur, marketId, payoutNumerators, invalid, auth, function (err) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              console.log(chalk.green("Initial Report Done"));
              callback(null);
            });
          });
        });
      });
    }
  });
}

module.exports = initialReport;
