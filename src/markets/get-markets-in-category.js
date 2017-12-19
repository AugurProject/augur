"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the markets within a specific category. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe from which to get the markets, as a hexadecimal string.
 * @param {string} p.category Name of the category from which to get the markets.
 * @param {string=} p.sortBy Field name by which to sort the markets.
 * @param {boolean=} p.isSortDescending Whether to sort the markets in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of markets to return.
 * @param {string=} p.offset Number of markets to truncate from the beginning of the results.
 * @param {function} callback Called after the markets have been retrieved.
 * @return {string[]} Array of market addresses in the specified category, as hexadecimal strings.
 */
function getMarketsInCategory(p, callback) {
  augurNode.submitRequest("getMarketsInCategory", p, callback);
}

module.exports = getMarketsInCategory;
