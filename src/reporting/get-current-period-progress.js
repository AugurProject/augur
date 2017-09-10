"use strict";

function getCurrentPeriodProgress(reportingPeriodDurationInSeconds, timestamp) {
  var t = timestamp || parseInt(new Date().getTime() / 1000, 10);
  return 100 * (t % reportingPeriodDurationInSeconds) / reportingPeriodDurationInSeconds;
}

module.exports = getCurrentPeriodProgress;
