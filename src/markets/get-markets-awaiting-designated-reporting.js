"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the markets in a specific universe that are waiting for a designated report to be submitted. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe from which to retrieve markets, as a hexadecimal string.
 * @param {string=} p.designatedReporter Address of a specific designated reporter by which to filter the results, as a hexadecimal string.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort the markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markets to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {string[]} Array of market addresses awaiting a designated report, as hexadecimal strings.
 */
function getMarketsAwaitingDesignatedReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingDesignatedReporting", p, callback);
}

module.exports = getMarketsAwaitingDesignatedReporting;
