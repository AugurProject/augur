"use strict";

/**
* @typedef {Object} MarketCreatorFee
* @property {string} marketId Address of a market, as a hexadecimal string.
* @property {number|string} unclaimedFee Fee available to be claimed from the market, by the market creator, in attoETH
*/

var augurNode = require("../augur-node");

/**
 * Returns information about unclaimed market creator fees. Fees are only available on finalized markets.
 * @param {Object} p Parameters object.
 * @param {string[]} p.marketIds Contract addresses of the markets for which to get details, as hexadecimal strings.
 * @return {MarketCreatorFee[]}
 */
function getUnclaimedMarketCreatorFees(p, callback) {
  augurNode.submitRequest("getUnclaimedMarketCreatorFees", p, callback);
}

module.exports = getUnclaimedMarketCreatorFees;
