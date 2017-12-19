/**
 * @todo Update function description & return information once function has been implemented.
 */

"use strict";

var augurNode = require("../augur-node");

/**
 * This function has not been implemented yet. Returns the markets in a specific reporting window that are able to be disputed, along with the value of the dispute bond needed to dispute each market’s result. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.reportingWindow Contract address of the reporting window from which to retrieve the disputable markets.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markets to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {} Pending.
 */
function getDisputableMarkets(p, callback) {
  augurNode.submitRequest("getDisputableMarkets", p, callback);
}

module.exports = getDisputableMarkets;
