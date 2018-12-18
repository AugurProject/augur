#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("Push time so the Market can be finalized, depends on initial report"));
  console.log(chalk.red("--noPush do not move time, just finalize the market"));
}

function callFinalize(augur, marketId, auth, callback) {
  augur.api.Market.finalize({
    meta: auth,
    tx: { to: marketId },
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
      callback(null);
    },
    onFailed: function (err) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(err)));
      console.error("Failed to finalize market");
      callback(err);
    },
  });
}

function finalizeMarket(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
  var noPush = args.opt.noPush;
  if (noPush) return callFinalize(augur, marketId, auth, callback);

  var marketPayload = { tx: { to: marketId } };
  augur.api.Market.getDisputeWindow(marketPayload, function (err, disputeWindowAddress) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    if (disputeWindowAddress === "0x0000000000000000000000000000000000000000") {
      console.log(chalk.red("Market has not be reported on, need initial-report before finalization"));
      return callback(null);
    }
    var disputeWindowPayload = { tx: { to: disputeWindowAddress } };
    augur.api.DisputeWindow.getEndTime(disputeWindowPayload, function (err, endTime) {
      endTime = parseInt(endTime, 10) + 10000; // past dispute window end time
      getTime(augur, auth, function (err, timeResult) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        displayTime("Current Time", timeResult.timestamp);
        if (parseInt(timeResult.timestamp, 10) > endTime) {
          callFinalize(augur, marketId, auth, callback);
        } else {
          setTimestamp(augur, endTime, timeResult.timeAddress, auth, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            callFinalize(augur, marketId, auth, callback);
          });
        }
      });
    });
  });
}

module.exports = finalizeMarket;
