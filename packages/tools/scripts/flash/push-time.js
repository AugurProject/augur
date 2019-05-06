#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function help() {
  console.log(chalk.red("This method is no longer available, use either"));
  console.log(chalk.red("push-timestamp"));
  console.log(chalk.red("set-timestamp"));
}

function pushTime(augur, args, auth, callback) {
  help();
  return callback(null);
}

module.exports = pushTime;
