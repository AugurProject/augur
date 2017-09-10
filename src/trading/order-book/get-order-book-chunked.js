"use strict";

var assign = require("lodash.assign");
var getOrderBook = require("./get-order-book");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var noop = require("../../utils/noop");
var GETTER_CHUNK_SIZE = require("../../constants").GETTER_CHUNK_SIZE;

/**
 * @param {Object} p Parameters object.
 * @param {number} p._type Order type (0 for "buy", 1 for "sell").
 * @param {string} p._market Ethereum address of this market's contract instance, as a hexadecimal string.
 * @param {number} p._outcome Outcome ID to look up the order book for, must be an integer value on [1, 8].
 * @param {string=} p._startingOrderId The order ID from which to start walking towards the order book's tail, as a hexadecimal string (default: 0x0).
 * @param {number=} p._numOrdersToLoad Number of orders to load per chunk, as a whole number (default: GETTER_CHUNK_SIZE).
 * @param {string} p.minPrice This market's minimum possible price, as a base-10 string.
 * @param {string} p.maxPrice This market's maximum possible price, as a base-10 string.
 * @param {function=} onChunkReceived Called when a chunk of the order book is received and parsed (default: noop).
 * @param {function=} onComplete Called when all chunks of the order book for this market/outcome/type has been received and parsed (default: noop).
 * @return {getOrderBook.SingleOutcomeOrderBookSide} One side of the order book (buy or sell) for this market and outcome.
 */
function getOrderBookChunked(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!isFunction(onComplete)) onComplete = noop;
  if (p.minPrice == null || p.maxPrice == null) {
    return onComplete("Must specify minPrice and maxPrice");
  }
  if (!p.orderBook) p.orderBook = {};
  getOrderBook({
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome,
    _startingOrderId: p._startingOrderId || "0x0",
    _numOrdersToLoad: p._numOrdersToLoad || GETTER_CHUNK_SIZE,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice
  }, function (err, orderBookChunk, lastOrderId) {
    if (err) return onComplete(err);
    onChunkReceived(orderBookChunk);
    assign(p.orderBook, orderBookChunk);
    api().Orders.getWorseOrderId({
      _orderId: lastOrderId,
      _type: p._type,
      _market: p._market,
      _outcome: p._outcome
    }, function (err, worseOrderId) {
      if (err) return onComplete(err);
      if (!parseInt(worseOrderId, 16)) return onComplete(null, p.orderBook);
      getOrderBookChunked(assign({}, p, { _startingOrderId: worseOrderId }), onChunkReceived, onComplete);
    });
  });
}

module.exports = getOrderBookChunked;
