"use strict";

/** Type definition for OrderBook.
 * @typedef {Object} OrderBook
 * @property {require("./simulation/simulate-trade").MarketOrderBook} Order book for a single market, keyed by market address.
 */

var getLogsChunked = require("../../logs/get-logs-chunked");
var isFunction = require("../../utils/is-function");
var noop = require("../../utils/noop");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.sender Ethereum address for which to lookup orders, as a hexadecimal string.
 * @param {string=} p.market Market contract address for which to lookup orders, as a hexadecimal string (if not provided, lookup orders for all markets).
 * @param {number=} p.outcome Outcome ID for which to lookup orders (if not provided, lookup all outcomes).
 * @param {number=} p.orderType Order type (1 for "buy", 2 for "sell"; default: both).
 * @param {number=} p.fromBlock Block number to start looking up logs; often this is the block number in which this account was registered (default: 1).
 * @param {number=} p.toBlock Block number where the log lookup should stop (default: latest).
 * @param {function=} onChunkReceived Called when a chunk of the account's orders is received and parsed (default: noop).
 * @param {function=} onComplete Called after the account's orders have been received and parsed (default: noop).
 * @return {OrderBook} All orders for this account, keyed by market, outcome ID, and order type.
 */
function getAccountOrderBook(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!isFunction(onComplete)) onComplete = noop;
  var aux = { index: ["market", "outcome", "orderType"], mergedLogs: {} };
  getLogsChunked({ label: "MakeOrder", filter: p, aux: aux }, onChunkReceived, function (err) {
    if (err) return onComplete(err);
    onComplete(aux.mergedLogs);
  });
}

module.exports = getAccountOrderBook;
