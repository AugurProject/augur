"use strict";

/**
 * Serves as an enum for the state of an order.
 * @typedef {Object} ORDER_STATE
 * @property {string} ALL Order is open, closed, or cancelled. (If no order state is specified, this is the default value.)
 * @property {string} OPEN Order is available to be filled.
 * @property {string} CLOSED Order has been filled.
 * @property {string} CANCELED Order has been canceled (although it may have been partially filled).
 */

/** Type definition for Order.
 * @typedef {Object} Order
 * @property {string} shareToken Contract address of the share token for which the order was placed, as a hexadecimal string.
 * @property {string} transactionHash Hash to look up the order transaction receipt.
 * @property {number} logIndex Number of the log index position in the Ethereum block containing the order transaction.
 * @property {string} owner The order maker's Ethereum address, as a hexadecimal string.
 * @property {number} creationTime Timestamp, in seconds, when the Ethereum block containing the order transaction was created.
 * @property {number} creationBlockNumber Number of the Ethereum block containing the order transaction.
 * @property {ORDER_STATE} orderState State of orders by which to filter results. Valid values are "ALL", "CANCELLED", "CLOSED", & "OPEN".
 * @property {number} price Rounded display price, as a base-10 number.
 * @property {number} amount Rounded number of shares to trade, as a base-10 number.
 * @property {string} fullPrecisionPrice Full-precision (un-rounded) display price, as a base-10 number.
 * @property {number} fullPrecisionAmount Full-precision (un-rounded) number of shares to trade, as a base-10 number.
 * @property {number} tokensEscrowed Number of the order maker's tokens held in escrow, as a base-10 number.
 * @property {number} sharesEscrowed Number of the order maker's shares held in escrow, as a base-10 number.
 */

/** Type definition for SingleOutcomeOrderBookSide.
 * @typedef {Object} SingleOutcomeOrderBookSide
 * @property {Order} Buy (bid) or sell (ask) orders, indexed by order ID.
 */

var augurNode = require("../augur-node");

/**
 * Returns a list of orders in a given universe or market. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string=} p.universe Contract address of the universe from which to retrieve orders, as a hexadecimal string. Either this parameter or the marketId must be specified.
 * @param {string=} p.marketId Contract address of the market from which to retrieve orders, as a hexadecimal string. Either this parameter or the universe must be specified.
 * @param {number=} p.outcome Market outcome to filter results by. Valid values are in the range [0,7].
 * @param {string=} p.creator Ethereum address of the order creator, as a hexadecimal string.
 * @param {ORDER_STATE=} p.orderState State of orders by which to filter results. Valid values are "ALL", "CANCELLED", "CLOSED", & "OPEN".
 * @param {number=} p.earliestCreationTime Earliest timestamp, in seconds, at which to truncate order results. (This timestamp is when the block on the Ethereum blockchain containing the transfer was created.)
 * @param {number=} p.latestCreationTime Latest timestamp, in seconds, at which to truncate order results. (This timestamp is when the block on the Ethereum blockchain containing the transfer was created.)
 * @param {string=} p.sortBy Field name by which to sort the orders.
 * @param {boolean=} p.isSortDescending Whether to sort orders in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of orders to return.
 * @param {string=} p.offset Number of orders to truncate from the beginning of the results.
 * @param {function} callback Called when the requested orders for this market/universe have been received and parsed.
 * @return {SingleOutcomeOrderBookSide} One side of the order book (buy or sell) for the specified market/universe and outcome.
 */
function getOrders(p, callback) {
  augurNode.submitRequest("getOrders", p, function (err, openOrders) {
    if (err) return callback(err);
    callback(null, openOrders || {});
  });
}

module.exports = getOrders;
