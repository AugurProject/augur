"use strict";

var assign = require("lodash.assign");
var getOrderBook = require("./get-order-book");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var noop = require("../../utils/noop");
var GETTER_CHUNK_SIZE = require("../../constants").GETTER_CHUNK_SIZE;

// { _type, _market, _outcome, _startingOrderId, _numOrdersToLoad, minPrice, maxPrice }
function getOrderBookChunked(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  getOrderBook({
    _type: p._type,
    _market: p._market,
    _outcome: p._outcome,
    _startingOrderId: p._startingOrderId,
    _numOrdersToLoad: p._numOrdersToLoad || GETTER_CHUNK_SIZE,
    minValue: p.minValue,
    maxValue: p.maxValue
  }, function (orderBookChunk, lastOrderId) {
    if (!orderBookChunk || orderBookChunk.error) return onComplete(orderBookChunk);
    onChunkReceived(orderBookChunk);
    api().Orders.getWorseOrderId({
      _orderId: lastOrderId,
      _type: p._type,
      _market: p._market,
      _outcome: p._outcome
    }, function (worseOrderId) {
      if (!parseInt(worseOrderId, 16)) return onComplete(null);
      getOrderBookChunked(assign({}, p, { _startingOrderId: p._startingOrderId }), onChunkReceived, onComplete);
    });
  });
}

module.exports = getOrderBookChunked;
