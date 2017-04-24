"use strict";

var getOrderBook = require("./get-order-book");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var noop = require("../../utils/noop");
var GETTER_CHUNK_SIZE = require("../../constants").GETTER_CHUNK_SIZE;

function getOrderBookChunked(marketID, offset, numTradesToLoad, scalarMinMax, totalTrades, chunkCB, callback) {
  if (!isFunction(chunkCB)) chunkCB = noop;
  if (!totalTrades) {
    return api().Trades.get_total_trades(marketID, function (totalTrades) {
      if (!totalTrades || totalTrades.error || !parseInt(totalTrades, 10)) {
        return callback(totalTrades);
      }
      getOrderBookChunked(marketID, offset, Math.min(parseInt(totalTrades, 10), GETTER_CHUNK_SIZE), scalarMinMax, totalTrades, chunkCB, callback);
    });
  }
  getOrderBook({
    market: marketID,
    offset: offset,
    numTradesToLoad: numTradesToLoad || totalTrades,
    scalarMinMax: scalarMinMax
  }, function (orderBookChunk) {
    if (!orderBookChunk || orderBookChunk.error) {
      return callback(orderBookChunk);
    }
    chunkCB(orderBookChunk);
    if (offset + numTradesToLoad < totalTrades) {
      return getOrderBookChunked(marketID, offset + numTradesToLoad, numTradesToLoad, scalarMinMax, totalTrades, chunkCB, callback);
    }
    callback(null);
  });
}

module.exports = getOrderBookChunked;
