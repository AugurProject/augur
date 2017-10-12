"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string=} p.reporter Look up reports submitted by this Ethereum address.
 * @param {string=} p.market Look up reports submitted on this market.
 * @param {string=} p.branch Look up reports submitted on markets within this branch.
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {Object} Reporting history, keyed by market ID.
 */
function getReportingHistory(p, callback) {
  augurNode.submitRequest("getReportingHistory", p, callback);
}

module.exports = getReportingHistory;
