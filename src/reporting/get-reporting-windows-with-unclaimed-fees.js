"use strict";

var augurNode = require("../augur-node");

function getReportingWindowsWithUnclaimedFees(p, callback) {
  augurNode.submitRequest("getReportingWindowsWithUnclaimedFees", p, callback);
}

module.exports = getReportingWindowsWithUnclaimedFees;
