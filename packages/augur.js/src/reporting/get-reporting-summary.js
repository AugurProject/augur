"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the number of markets in various reporting phases, including “DESIGNATED_REPORTING”, “FIRST_REPORTING”, “LAST_REPORTING”, “AWAITING_FINALIZATION” (when a market has been reported on and is in a dispute phase), “FORKING” (for the market that has forked), “AWAITING_FORK_MIGRATION” (for markets that are waiting for a forked market to resolve), and “FINALIZED”. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.reportingWindow Contract address of the reporting window for which to get the summary, as a hexadecimal string.
 * @param {function} callback Called after the reporting summary has been retrieved.
 * @return {Object} Summary of the number of markets in each reporting phase, keyed by reporting phase.
 */
function getReportingSummary(p, callback) {
  augurNode.submitRequest("getReportingSummary", p, callback);
}

module.exports = getReportingSummary;
