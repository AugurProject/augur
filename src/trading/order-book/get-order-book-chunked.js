"use strict";

var assign = require("lodash.assign");
var getOrderBook = require("./get-order-book");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var noop = require("../../utils/noop");
var GETTER_CHUNK_SIZE = require("../../constants").GETTER_CHUNK_SIZE;

// { marketID, offset, numTradesToLoad, scalarMinMax, totalTrades }
function getOrderBookChunked(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!p.totalTrades) {
    return api().Trades.get_total_trades({ market_id: p.marketID }, function (totalTrades) {
      if (!totalTrades || totalTrades.error || !parseInt(totalTrades, 10)) {
        return onComplete(totalTrades);
      }
      getOrderBookChunked(assign({}, p, {
        numTradesToLoad: Math.min(parseInt(totalTrades, 10), GETTER_CHUNK_SIZE),
        totalTrades: totalTrades
      }), onChunkReceived, onComplete);
    });
  }
  getOrderBook({
    market: p.marketID,
    offset: p.offset,
    numTradesToLoad: p.numTradesToLoad || p.totalTrades,
    scalarMinMax: p.scalarMinMax
  }, function (orderBookChunk) {
    if (!orderBookChunk || orderBookChunk.error) return onComplete(orderBookChunk);
    onChunkReceived(orderBookChunk);
    if (p.offset + p.numTradesToLoad < p.totalTrades) {
      return getOrderBookChunked(assign({}, p, { offset: p.offset + p.numTradesToLoad }), onChunkReceived, onComplete);
    }
    onComplete(null);
  });
}

module.exports = getOrderBookChunked;
