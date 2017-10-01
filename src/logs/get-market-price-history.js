"use strict";

/** Type definition for TimestampedPrice.
 * @typedef {Object} TimestampedPrice
 * @property {string} price Display (non-normalized) price, as a base-10 string.
 * @property {number} timestamp Unix timestamp for this price in seconds, as an integer.
 */

/** Type definition for SingleOutcomePriceTimeSeries.
 * @typedef {Object} SingleOutcomePriceTimeSeries
 * @property {TimestampedPrice[]} Array of timestamped price points for this outcome.
 */

/** Type definition for MarketPriceTimeSeries.
 * @typedef {Object} MarketPriceTimeSeries
 * @property {SingleOutcomePriceTimeSeries} Price time-series for a single outcome, keyed by outcome ID.
 */

var getLogsChunked = require("./get-logs-chunked");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.market Market contract address for which to lookup orders, as a hexadecimal string.
 * @param {number=} p.outcome Outcome ID for which to lookup orders (if not provided, lookup all outcomes).
 * @param {number=} p.fromBlock Block number to start looking up logs; often this is the block number in which this market was created (default: 1).
 * @param {number=} p.toBlock Block number where the log lookup should stop; if the market is closed, this can be the closing block number (default: latest).
 * @param {function=} onChunkReceived Called when a chunk of the price time-series is received and parsed (default: noop).
 * @param {function=} onComplete Called after the price time-series has been received and parsed (default: noop).
 * @return {MarketPriceTimeSeries} This market's price time-series, keyed by outcome ID.
 */
function getMarketPriceHistory(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!isFunction(onComplete)) onComplete = noop;
  getLogsChunked({ label: "FillOrder", filter: p }, onChunkReceived, function (err, logs) {
    if (err) return onComplete(err);
    var mergedLogs = {};
    logs.forEach(function (log) {
      if (!mergedLogs[log.outcome]) mergedLogs[log.outcome] = [];
      mergedLogs[log.outcome].push({ price: log.price, timestamp: log.timestamp });
    });
    onComplete(null, mergedLogs);
  });
}

module.exports = getMarketPriceHistory;
