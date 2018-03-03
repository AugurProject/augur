#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");

function help(callback) {
  console.log(chalk.red("Two ways to move time"));
  console.log(chalk.red("--------------------------"));
  console.log(chalk.red("1) SET a specific timestamp"));
  console.log(chalk.red("2) PUSH the current timestamp by days or weeks"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("SET ==> SET,1518211486 "));
  console.log(chalk.red("Simply setting system timestamp to 1518211486 "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("SET ==> SET,CURRENT "));
  console.log(chalk.red("Simply setting system timestamp to your current timestamp "));
  console.log(chalk.red("                           "));
  console.log(chalk.red("PUSH ===> PUSH,+3d"));
  console.log(chalk.red("Here we are pushing current timestamp by adding 3 days"));
  console.log(chalk.red("                           "));
  console.log(chalk.red("PUSH ===> PUSH,-2w"));
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
    getTime(augur, auth, function (err, timeResult) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      augur.api.Controller.getTimestamp(function (err, timestamp) {
        if (err) {
          console.log(chalk.red("Error "), chalk.red(err));
          return callback(err);
        }
        displayTime("current time:", timestamp);
        if (action === "SET") {
          if (value === "CURRENT") {
            value = Math.floor(new Date().getTime()/1000);
          } else {
            value = parseInt(value, 10);
          }
          setTimestamp(augur, value, timeResult.timeAddress, auth, callback);
        } else {
          timestamp = parseInt(timestamp, 10);
          var modTimeBy = 0;
          var digit = parseInt(params.match(regex), 10);
          var subtraction = params.indexOf("-") === -1 ? false : true;
          var secondsPerDay = 86400;
          if (params.indexOf("d") === -1) {
            modTimeBy = secondsPerDay * 7; // week
          } else {
            modTimeBy = secondsPerDay; // day
          }
          var totalMovement = modTimeBy * digit;
          var newTimestamp = subtraction ? timestamp - totalMovement : timestamp + totalMovement;
          setTimestamp(augur, newTimestamp, timeResult.timeAddress, auth, callback);
        }
      });
    });
  }
}

module.exports = pushTime;
