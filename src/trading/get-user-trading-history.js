/**
 * @todo Add descriptions for UserTrade.price, UserTrade.amount, UserTrade.timestamp, & UserTrade.tradeGroupId.
 */
"use strict";

/**
 * @typedef {Object} UserTrade
 * @property {string} transactionHash Hash to look up the trade transaction receipt.
 * @property {number} logIndex Number of the log index position in the Ethereum block containing the trade transaction.
 * @property {string} type Type of trade. Valid values are "buy" and "sell".
 * @property {number} price Description pending.
 * @property {number} amount Description pending.
 * @property {boolean} maker Whether the specified user is the order maker (as opposed to filler).
 * @property {number} marketCreatorFees Amount of fees paid to market creator, in ETH.
 * @property {number} reporterFees Amount of fees paid to reporters, in ETH.
 * @property {string} marketId Contract address of the market, as a hexadecimal string.
 * @property {number} outcome Outcome being bought/sold.
 * @property {string} shareToken Contract address of the share token that was bought or sold, as a hexadecimal string.
 * @property {number} timestamp Description pending.
 * @property {number|null} tradeGroupId ID logged with each trade transaction (can be used to group trades client-side), as a hex string.
 */

var augurNode = require("../augur-node");

/**
 * Returns information about the trades a specific user has made. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.account Ethereum address of the user for which to retrieve trading history, as a hexadecimal string.
 * @param {string=} p.universe Contract address of the universe in which to look up the trading history, as a hexadecimal string. Either this parameter or the market ID must be specified.
 * @param {string=} p.marketId Contract address of the market in which to look up the trading history, as a hexadecimal string. Either this parameter or the universe must be specified.
 * @param {string} p.outcome Outcome of the share being bought/sold.
 * @param {string} p.orderType Type of trade. Valid values are "buy" and "sell".
 * @param {string=} p.sortBy Field name by which to sort the trading history.
 * @param {boolean=} p.isSortDescending Whether to sort the trading history in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of trading history reports to return.
 * @param {string=} p.offset Number of trading history reports to truncate from the beginning of the results.
 * @param {function} callback Called when trading history has been received and parsed.
 * @return {UserTrade[]} Array of the user's trades, keyed by universe/market ID.
*/
function getUserTradingHistory(p, callback) {
  augurNode.submitRequest("getUserTradingHistory", p, callback);
}

module.exports = getUserTradingHistory;
