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

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.market Market contract address for which to lookup orders, as a hexadecimal string.
 * @param {number=} p.outcome Outcome ID for which to lookup orders (if not provided, lookup all outcomes).
 * @param {function} callback Called after the price time-series has been received and parsed.
 * @return {MarketPriceTimeSeries} This market's price time-series, keyed by outcome ID.
 */
function getMarketPriceHistory(p, callback) {
  augurNode.submitRequest("getMarketPriceHistory", p, callback);
  // getLogsChunked({ label: "FillOrder", filter: p }, onChunkReceived, function (err, logs) {
  //   if (err) return onComplete(err);
  //   var mergedLogs = {};
  //   logs.forEach(function (log) {
  //     if (!mergedLogs[log.outcome]) mergedLogs[log.outcome] = [];
  //     mergedLogs[log.outcome].push({ price: log.price, timestamp: log.timestamp });
  //   });
  //   onComplete(null, mergedLogs);
  // });
}

module.exports = getMarketPriceHistory;
