#!/usr/bin/env node

"use strict";

var getTimestamp = require("./get-timestamp");
var chalk = require("chalk");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("This command returns current time"));
}

/**
 * Move time to Market end time and do initial report
 */
function getTime(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  getTimestamp(augur, auth, function(err, timeResult) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    displayTime("Current Time", timeResult.timestamp);
    callback(null);
  });
}

module.exports = getTime;