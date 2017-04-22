"use strict";

var getMarketsInfo = require("../get-markets-info");
var isFunction = require("../utils/is-function");
var PAUSE_BETWEEN_MARKET_BATCHES = require("../constants").PAUSE_BETWEEN_MARKET_BATCHES;

// load each batch of marketdata sequentially and recursively until complete
function loadMarketsBatch(branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
  var numMarketsToLoad = isDesc ? Math.min(chunkSize, startIndex) : Math.min(chunkSize, numMarkets - startIndex);
  getMarketsInfo({
    branch: branchID,
    offset: startIndex,
    numMarketsToLoad: numMarketsToLoad,
    volumeMin: volumeMin,
    volumeMax: volumeMax
  }, function (marketsData) {
    var pause;
    if (!marketsData || marketsData.error) {
      chunkCB(marketsData);
    } else {
      chunkCB(null, marketsData);
    }
    pause = (Object.keys(marketsData).length) ? PAUSE_BETWEEN_MARKET_BATCHES : 5;
    if (isDesc && startIndex > 0) {
      setTimeout(function () {
        loadMarketsBatch(branchID, Math.max(startIndex - chunkSize, 0), chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass);
      }, pause);
    } else if (!isDesc && startIndex + chunkSize < numMarkets) {
      setTimeout(function () {
        loadMarketsBatch(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass);
      }, pause);
    } else if (isFunction(nextPass)) {
      setTimeout(function () { nextPass(); }, pause);
    }
  });
}

module.exports = loadMarketsBatch;
