#!/usr/bin/env node

"use strict";

var chalk = require("chalk");

function displayTime(message, numberTicks) {
  var currentTime = new Date(numberTicks * 1000);
  console.log(chalk.green.dim(message), chalk.green(currentTime), chalk.blue(numberTicks));
}

module.exports = displayTime;
