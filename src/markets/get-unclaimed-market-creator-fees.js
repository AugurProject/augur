"use strict";

/**
* @typedef {Object} FeeInfo
* @property {string} marketID Address of a market, as a hexadecimal string.
* @property {number|string} unclaimedFee Fee available to be claimed from the market, by the market creator
*/

var augurNode = require("../augur-node");

/**
 * Returns information about unclaimed market creator fees. Fees are only available on finalized markets.
 * @param {Object} p Parameters object.
 * @param {string[]} p.marketIDs Contract addresses of the markets for which to get details, as hexadecimal strings.
 * @returns {FeeInfo[]}
 */
function getUnclaimedMarketCreatorFees(p, callback) {
  augurNode.submitRequest("getUnclaimedMarketCreatorFees", p, callback);
}

module.exports = getUnclaimedMarketCreatorFees;
