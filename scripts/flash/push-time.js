#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");

function displayTime(message, numberTicks) {
  var currentTime = new Date(numberTicks * 1000);
  console.log(chalk.green.dim(message), chalk.green(currentTime), chalk.blue(numberTicks));
}

function setTime(augur, numberTicks, address, auth, callback) {
  displayTime("setting time to:", numberTicks);
  augur.api.TimeControlled.setTimestamp({
    meta: auth,
    tx: { to: address },
    _timestamp: numberTicks,
    onSent: function (result) {
      console.log(chalk.yellow.dim("Sent"), chalk.yellow(JSON.stringify(result)));
      console.log(chalk.yellow.dim("Waiting for reply ...."));
    },
    onSuccess: function (result) {
      var timestamp = augur.api.Controller.getTimestamp();
      console.log(chalk.green.dim("Success"), chalk.green(JSON.stringify(result)));
      console.log(chalk.green("New Current Tiome"), chalk.green(timestamp));
      displayTime("result of time change", timestamp);
      callback(null);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
      callback(null);
    },
  });
}

function help(callback) {
  console.log(chalk.red("Two ways to move time"));
  console.log(chalk.red("--------------------------"));
  console.log(chalk.red("1) SET a specific timestamp"));
  console.log(chalk.red("2) PUSH the current timestamp by days or weeks"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("SET ==> params=SET,1518211486 "));
  console.log(chalk.red("Simply setting system timestamp to 1518211486 "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("SET ==> params=SET,CURRENT "));
  console.log(chalk.red("Simply setting system timestamp to your current timestamp "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("PUSH ===> params=PUSH,+3d"));
  console.log(chalk.red("Here we are pushing current timestamp by adding 3 days"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("PUSH ===> params=PUSH,-2w"));
  console.log(chalk.red("Here we are pushing current timestamp by substracting 2 weeks"));
  callback(null);
}

function pushTime(augur, params, auth, callback) {
  var regex = /\d+/g;
  if (!params || params === "help" || params.split(",").length < 2) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var action = paramArray[0];
    var value = paramArray[1];
    getTime(augur, auth, function (timeResult) {
      var timestamp = parseInt(augur.api.Controller.getTimestamp(), 10);
      displayTime("current time:", timestamp);

      if (action === "SET") {
        if (value === "CURRENT") {
          value = Math.floor(new Date().getTime()/1000);
        }
        setTime(augur, value, timeResult.address, auth, callback);
      } else {
        var amount = 0;
        var digit = parseInt(params.match(regex), 10);
        var subtraction = params.indexOf("-") === -1 ? false : true;
        if (params.indexOf("d") === -1) {
          amount = 540000; // week
        } else {
          amount = 108000; // day
        }
        var totalMovement = amount * digit;
        var newTimestamp = subtraction ? timestamp - totalMovement : timestamp + totalMovement;
        setTime(augur, newTimestamp, timeResult.address, auth, callback);
      }
    });
  }
}

module.exports = pushTime;
