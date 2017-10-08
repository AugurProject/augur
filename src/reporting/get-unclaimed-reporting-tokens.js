"use strict";

var augurNode = require("../augur-node");

function getUnclaimedReportingTokens(p, callback) {
  augurNode.submitRequest("getUnclaimedReportingTokens", p, callback);
}

module.exports = getUnclaimedReportingTokens;
