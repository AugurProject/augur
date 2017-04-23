"use strict";

var abi = require("augur-abi");

function filterByBranchID(branchID, logs) {
  if (branchID) {
    logs = logs.filter(function (log) {
      return log.branch === abi.format_int256(branchID);
    });
  }
  return logs.map(function (log) { return log.marketID; });
}

module.exports = filterByBranchID;
