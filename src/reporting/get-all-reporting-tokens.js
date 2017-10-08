"use strict";

var augurNode = require("../augur-node");

function getAllReportingTokens(p, callback) {
  augurNode.submitRequest("getAllReportingTokens", p, callback);
}

module.exports = getAllReportingTokens;
