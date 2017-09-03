"use strict";

var speedomatic = require("speedomatic");

function filterByBranchID(branchID, logs) {
  if (branchID) {
    logs = logs.filter(function (log) {
      return log.branch === speedomatic.formatInt256(branchID);
    });
  }
  return logs.map(function (log) { return log.marketID; });
}

module.exports = filterByBranchID;
