/**
 * @todo Provide details for how category popularity is calculated.
 */

"use strict";

/**
 * @typedef {Object} Category
 * @property {string} category Name of a category.
 * @property {number|string} popularity Category popularity. (The exact method for calculating this value is still pending.)
 */

var augurNode = require("../augur-node");

/**
 * Returns the market categories in a specific universe. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe from which to retrieve the categories, as a hexadecimal string.
 * @param {string=} p.sortBy Field name by which to sort the categories.
 * @param {boolean=} p.isSortDescending Whether to sort categories in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of categories to return.
 * @param {string=} p.offset Number of categories to truncate from the beginning of the results.
 * @param {function} callback Called after the categories have been retrieved.
 * @return {Category[]} Array representing the categories in the specified universe.
 */
function getCategories(p, callback) {
  augurNode.submitRequest("getCategories", p, callback);
}

module.exports = getCategories;
