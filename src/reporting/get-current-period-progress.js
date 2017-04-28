"use strict";

function getCurrentPeriodProgress(periodLength, timestamp) {
  var t = timestamp || parseInt(new Date().getTime() / 1000, 10);
  return 100 * (t % periodLength) / periodLength;
}

module.exports = getCurrentPeriodProgress;
