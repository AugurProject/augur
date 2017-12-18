"use strict";

var augurNode = require("../augur-node");

/**
 * Returns an array of markets in a specific universe. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe from which to get transfer history.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort the markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markts to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {string[]} Array of market addresses in the universe, as hexadecimal strings.
 */
function getMarkets(p, callback) {
  augurNode.submitRequest("getMarkets", p, callback);
}

module.exports = getMarkets;
