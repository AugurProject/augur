/**
 * @todo Update `p.reportingState` once new reporting changes are added.
 */

"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the markets in a particular universe or reporting window that are waiting for a designated report to be submitted or waiting for the reporting phase to end. Either the universe or reporting window must be specified. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string=} p.universe Contract address of the universe from which to retrieve markets, as a hexadecimal string. If this parameter is not specified, a reporting window must be specified instead.
 * @param {string=} p.reportingWindow Contract address of the reporting window from which to retrieve the markets, as a hexadecimal string. If this parameter is not specified, a universe must be specified instead.
 * @param {string=} p.reportingState Description pending.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort the markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markets to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {string[]} Array of market addresses awaiting a designated report, as hexadecimal strings.
 */
function getMarketsAwaitingReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingReporting", p, callback);
}

module.exports = getMarketsAwaitingReporting;
