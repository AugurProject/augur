#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");

function help() {
  console.log(chalk.red("Set new current timestamp"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("example: params >>> ' 1524512562 ', means sets timestamp to 1524512562"));
}

function setTimestampCmd(augur, args, auth, callback) {
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
    setTimestamp(augur, parseInt(args.opt.timestamp, 10), timeResult.timeAddress, auth, callback);
  });
}

module.exports = setTimestampCmd;
