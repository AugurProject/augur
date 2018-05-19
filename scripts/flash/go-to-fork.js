#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var doMarketContribute = require("./do-market-contribute");
var doInitialReport = require("./do-initial-report");
var setTimestamp = require("./set-timestamp");

var ALL_THE_REP = 6000000000000000000000000;

function goToFork(augur, marketId, payoutNumerators, timeAddress, stopsBefore, auth, callback) {
  augur.api.Market.getForkingMarket({tx: { to: marketId }}, function (err, forkingMarket) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    if (forkingMarket !== "0x0000000000000000000000000000000000000000") {
      console.log(chalk.green("Successfully Forked"));
      return callback(null);
    }
    augur.api.Market.getNumParticipants({tx: { to: marketId}}, function (err, numParticipants) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      if (stopsBefore && parseInt(numParticipants, 10) === (20 - stopsBefore)) {
        console.log(chalk.green("Successfully got to pre-forking state"));
        return callback(null);
      }
      augur.api.Market.getFeeWindow({tx: { to: marketId}}, function (err, feeWindow) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        if (feeWindow !== "0x0000000000000000000000000000000000000000") {
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
                goToFork(augur, marketId, payoutNumerators.reverse(), timeAddress, stopsBefore, auth, callback);
              });
            });
          });
        } else {
          doInitialReport(augur, marketId, payoutNumerators, false, auth, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            goToFork(augur, marketId, payoutNumerators.reverse(), timeAddress, stopsBefore, auth, callback);
          });
        }
      });
    });
  });
}

module.exports = goToFork;
