"use strict";

/** Type definition for SingleOutcomeOrderBookSide.
 * @typedef {Object} SingleOutcomeOrderBookSide
 * @property {require("./get-order").Order} Buy (bid) or sell (ask) orders, indexed by order ID.
 */

var api = require("../../api");
var parseOrderBook = require("../../parsers/order-book");

/**
 * Looks up the order book for a specified market/outcome/type.
 * Note: getOrderBook generally should be used only to fetch a small chunk of orders. To fetch entire order books, typically
 * getOrderBookChunked should be used instead!
 * @param {Object} p Parameters object.
 * @param {number} p._type Order type (1 for "buy", 2 for "sell").
 * @param {string} p._market Ethereum address of this market's contract instance, as a hexadecimal string.
 * @param {number} p._outcome Outcome ID to look up the order book for, must be an integer value on [1, 8].
 * @param {string=} p._startingOrderId The order ID from which to start walking towards the order book's tail, as a hexadecimal string (default: 0x0 / start from the best order).
 * @param {number=} p._numOrdersToLoad Number of orders to load, as a whole number (default: 0 / load all orders).
 * @param {string} p.minPrice This market's minimum possible price, as a base-10 string.
 * @param {string} p.maxPrice This market's maximum possible price, as a base-10 string.
 * @param {function} callback Called when the requested order book for this market/outcome/type has been received and parsed.
 * @return {SingleOutcomeOrderBookSide} One side of the order book (buy or sell) for this market and outcome.
 */
function getOrderBook(p, callback) {
  if (p.minPrice == null || p.maxPrice == null) {
    return callback({ error: "Must specify minPrice and maxPrice" });
  }
  api().OrderBook.getOrderBook({
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome,
    _startingOrderId: p._startingOrderId || "0x0",
    _numOrdersToLoad: p._numOrdersToLoad || 0
  }, function (orderBook) {
    callback(parseOrderBook(p._type, p.minPrice, p.maxPrice, orderBook), orderBook[orderBook.length - 10]);
  });
}

module.exports = getOrderBook;
