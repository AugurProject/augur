"use strict";

var assign = require("lodash.assign");
var getMarketsInfo = require("./get-markets-info");
var isFunction = require("../utils/is-function");
var PAUSE_BETWEEN_MARKET_BATCHES = require("../constants").PAUSE_BETWEEN_MARKET_BATCHES;

// load each batch of marketdata sequentially and recursively until complete
// { branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax }
function loadMarketsBatch(p, onChunkReceived, onComplete) {
  getMarketsInfo({
    branch: p.branchID,
    offset: p.startIndex,
    numMarketsToLoad: Math.min(p.chunkSize, p.numMarkets - p.startIndex),
    volumeMin: p.volumeMin,
    volumeMax: p.volumeMax
  }, function (marketsData) {
    var pause;
    if (!marketsData || marketsData.error) {
      onChunkReceived(marketsData);
    } else {
      onChunkReceived(null, marketsData);
    }
    pause = (Object.keys(marketsData).length) ? PAUSE_BETWEEN_MARKET_BATCHES : 5;
    if (p.isDesc && p.startIndex > 0) {
      setTimeout(function () {
        loadMarketsBatch(assign({}, p, { startIndex: Math.max(p.startIndex - p.chunkSize, 0) }), onChunkReceived, onComplete);
      }, pause);
    } else if (!p.isDesc && p.startIndex + p.chunkSize < p.numMarkets) {
      setTimeout(function () {
        loadMarketsBatch(assign({}, p, { startIndex: p.startIndex + p.chunkSize }), onChunkReceived, onComplete);
      }, pause);
    } else if (isFunction(onComplete)) {
      setTimeout(function () { onComplete(); }, pause);
    }
  });
}

module.exports = loadMarketsBatch;
