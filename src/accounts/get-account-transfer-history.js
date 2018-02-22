"use strict";

/**
 * @typedef {Object} AccountTransfer
 * @property {string} transactionHash Hash returned by token transfer.
 * @property {number} logIndex Number of the log index position in the Ethereum block containing the transfer.
 * @property {number} creationBlockNumber Number of the Ethereum block containing the transfer.
 * @property {string} blockHash Hash of the Ethereum block containing the transfer.
 * @property {number} creationTime Timestamp, in seconds, when the Ethereum block containing the transfer was created.
 * @property {string|null} sender Ethereum address of the token sender. If null, this indicates that new tokens were minted and sent to the user.
 * @property {string|null} recipient Ethereum address of the token recipient. If null, this indicates that tokens were burned (i.e., destroyed).
 * @property {string} token Contract address of the contract for the sent token, as a hexadecimal string.
 * @property {number} value Quantity of tokens sent.
 * @property {string|null} symbol Token symbol (if any).
 * @property {number|null} outcome Market outcome with which the token is associated (if any).
 * @property {string|null} marketId Contract address of the market in which the tranfer took place, as a hexadecimal string (if any).
 */

var augurNode = require("../augur-node");

/**
 * Returns the token transfers made to or from a specific Ethereum address. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.account Ethereum address of the account for which to get transfer history, as a hexadecimal string.
 * @param {string=} p.token Contract address of the token contract by which to limit the history results, as a hexadecimal string.
 * @param {number=} p.earliestCreationTime Earliest timestamp, in seconds, at which to truncate history results. (This timestamp is when the block on the Ethereum blockchain containing the transfer was created.)
 * @param {number=} p.latestCreationTime Latest timestamp, in seconds, at which to truncate history results. (This timestamp is when the block on the Ethereum blockchain containing the transfer was created.)
 * @param {string=} p.sortBy Field name by which to sort transfer history.
 * @param {boolean=} p.isSortDescending Whether to sort transfers in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of transfers to return.
 * @param {string=} p.offset Number of transfers to truncate from the beginning of the history results.
 * @param {function} callback Called after the account transfer history has been retrieved.
 * @return {AccountTransfer[]} Array representing the account's transfer history.
 */
function getAccountTransferHistory(p, callback) {
  augurNode.submitRequest("getAccountTransferHistory", p, callback);
}

module.exports = getAccountTransferHistory;
