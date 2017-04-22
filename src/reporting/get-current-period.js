"use strict";

function getCurrentPeriod(periodLength, timestamp) {
  var t = timestamp || parseInt(new Date().getTime() / 1000, 10);
  return Math.floor(t / periodLength);
}

module.exports = getCurrentPeriod;
