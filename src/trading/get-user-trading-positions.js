/**
 * @todo Add descriptions for UserTradePosition.numSharesAdjustedForUserIntention, UserTradePosition.realizedProfitLoss, & UserTradePosition.unrealizedProfitLoss.
 */
"use strict";

/**
 * @typedef {Object} UserTradePosition
 * @property {string} marketId Contract address of the market, as a hexadecimal string.
 * @property {number} outcome Outcome of the shares the user owns.
 * @property {number} numShares Quantity of shares currently owned by the user.
 * @property {number} numSharesAdjustedForUserIntention Description pending.
 * @property {number} realizedProfitLoss Description pending.
 * @property {number} unrealizedProfitLoss Description pending.
 */

var augurNode = require("../augur-node");

/**
 * Returns the trading positions held by a specific user. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.account Ethereum address of the user for which to retrieve trading positions, as a hexadecimal string.
 * @param {string=} p.universe Contract address of the universe in which to look up the trading positions, as a hexadecimal string. Either this parameter or the market ID must be specified.
 * @param {string=} p.marketId Contract address of the market in which to look up the trading positions, as a hexadecimal string. Either this parameter or the universe must be specified.
 * @param {string} p.outcome Outcome of the share held for the market.
 * @param {string=} p.sortBy Field name by which to sort the trading positions.
 * @param {boolean=} p.isSortDescending Whether to sort the trading positions in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of trading positions reports to return.
 * @param {string=} p.offset Number of trading positions reports to truncate from the beginning of the results.
 * @param {function} callback Called when the trading positions have been received and parsed.
 * @return {UserTradePosition[]} Array of the user's trading positions.
 */
function getUserTradingPositions(p, callback) {
  augurNode.submitRequest("getUserTradingPositions", p, callback);
}

module.exports = getUserTradingPositions;
