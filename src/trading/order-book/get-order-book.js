"use strict";

/** Type definition for Order.
 * @typedef {Object} Order
 * @property {string} amount Rounded number of shares to trade, as a base-10 string.
 * @property {string} fullPrecisionAmount Full-precision (un-rounded) number of shares to trade, as a base-10 string.
 * @property {string} price Rounded display price, as a base-10 string.
 * @property {string} fullPrecisionPrice Full-precision (un-rounded) display price, as a base-10 string.
 * @property {string} sharesEscrowed Number of the order maker's shares held in escrow, as a base-10 string.
 * @property {string} tokensEscrowed Number of the order maker's tokens held in escrow, as a base-10 string.
 * @property {string} owner The order maker's Ethereum address, as a hexadecimal string.
 * @property {string} betterOrderId ID of the order one step closer to the order book's head, as a hexadecimal string.
 * @property {string} worseOrderId ID of the order one step closer to the order book's tail, as a hexadecimal string.
 */

/** Type definition for SingleOutcomeOrderBookSide.
 * @typedef {Object} SingleOutcomeOrderBookSide
 * @property {Order} Buy (bid) or sell (ask) orders, indexed by order ID.
 */

var augurNode = require("../../augur-node");

/**
 * Looks up the order book for a specified market/outcome/type.
 * Note: getOrderBook generally should be used only to fetch a small chunk of orders. To fetch entire order books, typically
 * getOrderBookChunked should be used instead!
 * @param {Object} p Parameters object.
 * @param {number} p.type Order type (0 for "buy", 1 for "sell").
 * @param {string} p.market Ethereum address of this market's contract instance, as a hexadecimal string.
 * @param {number} p.outcome Outcome ID to look up the order book for, must be an integer value on [1, 8].
 * @param {number=} p.limit Number of orders to load, as a whole number (default: 0 / load all orders).
 * @param {string} p.minPrice This market's minimum possible price, as a base-10 string.
 * @param {string} p.maxPrice This market's maximum possible price, as a base-10 string.
 * @param {function} callback Called when the requested order book for this market/outcome/type has been received and parsed.
 * @return {SingleOutcomeOrderBookSide} One side of the order book (buy or sell) for this market and outcome.
 */
function getOrderBook(p, callback) {
  if (p.minPrice == null || p.maxPrice == null) {
    return callback("Must specify minPrice and maxPrice");
  }
  augurNode.submitRequest("getOrderBook", p, callback);
  // api().OrderBook.getOrderBook({
  //   _type: p._type,
  //   _market: p._market,
  //   _outcome: p._outcome,
  //   _startingOrderId: p._startingOrderId || "0x0",
  //   _numOrdersToLoad: p._numOrdersToLoad || 0
  // }, function (err, orderBook) {
  //   if (err) return callback(err);
  //   callback(null, parseOrderBook(p._type, p.minPrice, p.maxPrice, orderBook), orderBook[orderBook.length - 10]);
  // });
}

module.exports = getOrderBook;
