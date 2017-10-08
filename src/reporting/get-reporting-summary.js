"use strict";

var augurNode = require("../augur-node");

function getReportingSummary(p, callback) {
  augurNode.submitRequest("getReportingSummary", p, callback);
}

module.exports = getReportingSummary;
