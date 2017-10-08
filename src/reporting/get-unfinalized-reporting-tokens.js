"use strict";

var augurNode = require("../augur-node");

function getUnfinalizedReportingTokens(p, callback) {
  augurNode.submitRequest("getUnfinalizedReportingTokens", p, callback);
}

module.exports = getUnfinalizedReportingTokens;
