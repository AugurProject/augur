"use strict";

var augurNode = require("../augur-node");

function getReportingFees(p, callback) {
  augurNode.submitRequest("getReportingFees", p, callback);
}

module.exports = getReportingFees;
