"use strict";

/** Type definition for TimestampedPrice.
 * @typedef {Object} TimestampedPrice
 * @property {number} price Display (non-normalized) price, as a base-10 number.
 * @property {number} amount Display price, as a base-10 number.
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
 * Returns the prices and timestamps of a specific market's outcomes over time. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.marketId Market contract address for which to look up orders, as a hexadecimal string.
 * @param {function} callback Called after the price time-series has been received and parsed.
 * @return {MarketPriceTimeSeries} This market's price time-series, keyed by outcome ID.
 */
function getMarketPriceHistory(p, callback) {
  augurNode.submitRequest("getMarketPriceHistory", p, callback);
}

module.exports = getMarketPriceHistory;
