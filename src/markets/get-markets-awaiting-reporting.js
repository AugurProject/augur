"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string=} p.universe Look up markets within this universe.
 * @param {string=} p.reportingWindow Look up markets within this reportingWindow
 * @param {string=} p.reportingRound Look up markets in this reportingState: FIRST_REPORTING|LAST_REPORTING. See REPORTING_STATE enum
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {Object} Markets history, keyed by market ID.
 */
function getMarketsAwaitingReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingReporting", p, callback);
}

module.exports = getMarketsAwaitingReporting;
