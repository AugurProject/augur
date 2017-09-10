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

var api = require("../../api");
var parseOrder = require("../../parsers/order");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._orderId Order ID as a hexadecimal string.
 * @param {number} p._type Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Ethereum address of this market's contract instance, as a hexadecimal string.
 * @param {number} p._outcome Outcome ID to look up the order book for, must be an integer value on [1, 8].
 * @param {string=} p._startingOrderId The order ID from which to start walking towards the order book's tail, as a hexadecimal string (default: 0x0).
 * @param {number=} p._numOrdersToLoad Number of orders to load per chunk, as a whole number (default: constants.GETTER_CHUNK_SIZE).
 * @param {string} p.minPrice This market's minimum possible price, as a base-10 string.
 * @param {string} p.maxPrice This market's maximum possible price, as a base-10 string.
 * @param {function} callback Called when the requested order has been received and parsed.
 * @return {Order} Parsed order object.
 */
function getOrder(p, callback) {
  if (p.minPrice == null || p.maxPrice == null) {
    return callback("Must specify minPrice and maxPrice");
  }
  api().OrdersFetcher.getOrder({
    _orderId: p._orderId,
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome
  }, function (err, order) {
    if (err) return callback(err);
    callback(null, parseOrder(p._type, p.minPrice, p.maxPrice, order));
  });
}

module.exports = getOrder;
