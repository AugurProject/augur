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

// { _orderId, _type, _market, _outcome, minPrice, maxPrice }
function getOrder(p, callback) {
  if (p.minPrice == null || p.maxPrice == null) {
    return callback(new Error("Must specify minPrice and maxPrice"));
  }
  api().OrdersFetcher.getOrder({
    _orderId: p._orderId,
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome
  }, function (order) {
    callback(parseOrder(p._type, p.minPrice, p.maxPrice, order));
  });
}

module.exports = getOrder;
