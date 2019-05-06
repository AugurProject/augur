#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");

function help() {
  console.log(chalk.red("Timestamp can only be pushed forward"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("parameters are count and unit (seconds is default)"));
  console.log(chalk.red("' -c 2 -d ', means 2 days"));
  console.log(chalk.red("' -c 2 -w ', means 2 week"));
  console.log(chalk.red("' -c 2 -s ', means 2 seconds"));
  console.log(chalk.red("example: params >>> ' -c 2 -s ', means push timestamp by 2 seconds"));
  console.log(chalk.red("example: params >>> ' -c 3 -d ', means push timestamp by 3 days"));
}

function pushTimestamp(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  getTime(augur, auth, function (err, timeResult) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    displayTime("current time:", timeResult.timestamp);
    var secondsPerDay = 86400;
    var count = parseInt(args.opt.count, 10);
    var modTimeBy = 0;
    if (args.opt.days) {
      modTimeBy = secondsPerDay; // day
    } else if (args.opt.weeks) {
      modTimeBy = secondsPerDay * 7; // week
    } else {
      modTimeBy = 1; // seconds
    }
    var value = parseInt(timeResult.timestamp, 10) + (modTimeBy * count);
    setTimestamp(augur, value, timeResult.timeAddress, auth, callback);
  });
}

module.exports = pushTimestamp;
