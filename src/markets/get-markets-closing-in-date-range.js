"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the markets closing between a given time range in a specific universe. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe from which to get the markets, as a hexadecimal string.
 * @param {number} p.earliestClosingTime Earliest market close timestamp at which to truncate market results, in seconds.
 * @param {number} p.latestClosingTime Latest market close timestamp at which to truncate market results, in seconds.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort the markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markets to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {string[]} Array of closing market addresses, as hexadecimal strings.
 */
function getMarketsClosingInDateRange(p, callback) {
  augurNode.submitRequest("getMarketsClosingInDateRange", p, callback);
}

module.exports = getMarketsClosingInDateRange;
